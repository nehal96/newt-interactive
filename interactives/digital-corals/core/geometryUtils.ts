import { Vector3, Polyp, Face, CoralGeometry } from "../types";
import * as THREE from "three";

// Helper function to calculate the normal of a triangle defined by three points
function calculateFaceNormal(p1: Vector3, p2: Vector3, p3: Vector3): Vector3 {
  const U: Vector3 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
  const V: Vector3 = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };

  const N: Vector3 = {
    x: U.y * V.z - U.z * V.y,
    y: U.z * V.x - U.x * V.z,
    z: U.x * V.y - U.y * V.x,
  };

  const length = Math.sqrt(N.x * N.x + N.y * N.y + N.z * N.z);
  if (length === 0) return { x: 0, y: 0, z: 1 }; // Should not happen for non-degenerate triangle
  return { x: N.x / length, y: N.y / length, z: N.z / length };
}

// Helper to add two vectors
function addVectors(v1: Vector3, v2: Vector3): Vector3 {
  return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
}

// Helper to normalize a vector
function normalizeVector(v: Vector3): Vector3 {
  const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  if (length === 0) return { x: 0, y: 0, z: 0 }; // Or throw error
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

/**
 * Creates the initial seed coral geometry as a hexagonal pyramid (hexacone).
 * The apex is the first polyp, and the base vertices are the next generation.
 * Normals are calculated for each polyp.
 * Geometry is Z-up (apex at (0,0,height), base on XY plane at z=0).
 *
 * @param radius The radius of the hexagonal base.
 * @param height The height of the pyramid.
 * @returns CoralGeometry object representing the seed structure.
 */
export function createSeedCoralGeometry(
  radius: number = 1,
  height: number = 1.5
): CoralGeometry {
  const polyps: Polyp[] = [];
  const faces: Face[] = [];

  // Apex polyp (V0) - Z-up coordinate system
  const apexPosition: Vector3 = { x: 0, y: 0, z: height };
  polyps.push({
    id: "polyp_apex",
    position: apexPosition,
    normal: { x: 0, y: 0, z: 1 } /* Initial normal for apex */,
  });

  // Base vertices (V1 to V6) on the XY plane (z=0)
  const basePositions: Vector3[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const position: Vector3 = {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
      z: 0,
    };
    basePositions.push(position);
    // Calculate horizontal normal pointing radially outwards
    const horizontalNormal = normalizeVector({
      x: position.x,
      y: position.y,
      z: 0,
    });
    polyps.push({ id: `polyp_base_${i}`, position, normal: horizontalNormal });
  }

  // Create faces for the sides of the pyramid
  // Each face connects the apex (index 0) to two adjacent base vertices
  const sideFaceNormals: Vector3[][] = Array(polyps.length)
    .fill(null)
    .map(() => []);

  for (let i = 0; i < 6; i++) {
    const baseVertexIndex1 = i + 1; // Polyp index for base vertex i
    const baseVertexIndex2 = ((i + 1) % 6) + 1; // Polyp index for base vertex i+1

    // Define the face (indices of polyps)
    const faceIndices: Face = [0, baseVertexIndex1, baseVertexIndex2];
    faces.push(faceIndices);

    // Calculate normal for this side face
    const p0 = polyps[0].position;
    const p1 = polyps[baseVertexIndex1].position;
    const p2 = polyps[baseVertexIndex2].position;
    const faceNormal = calculateFaceNormal(p0, p1, p2);

    // Add this face normal to the list of normals for each vertex in the face
    sideFaceNormals[0].push(faceNormal);
    sideFaceNormals[baseVertexIndex1].push(faceNormal);
    sideFaceNormals[baseVertexIndex2].push(faceNormal);
  }

  return { polyps, faces };
}

/**
 * Recalculates surface normals for all polyps in the coral geometry using Three.js
 * BufferGeometry.computeVertexNormals() for accurate and efficient normal computation.
 * This should be called after each simulation step when polyp positions have changed.
 *
 * @param geometry The current coral geometry with updated polyp positions
 * @returns A new CoralGeometry with updated normals for each polyp
 */
export function recalculatePolypNormals(
  geometry: CoralGeometry
): CoralGeometry {
  if (!geometry.polyps.length || !geometry.faces.length) {
    return geometry; // No geometry to process
  }

  // Create Three.js BufferGeometry for normal calculation
  const threeGeometry = new THREE.BufferGeometry();

  // Convert polyp positions to Three.js format
  const positions = new Float32Array(
    geometry.polyps.flatMap((p) => [p.position.x, p.position.y, p.position.z])
  );
  threeGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  // Set face indices
  const indices = geometry.faces.flat();
  threeGeometry.setIndex(indices);

  // Compute vertex normals using Three.js
  threeGeometry.computeVertexNormals();

  // Extract computed normals back to our data structure
  const normalAttribute = threeGeometry.getAttribute("normal");
  const updatedPolyps = geometry.polyps.map((polyp, index) => {
    let normal: Vector3;
    // Check if the polyp is a base polyp (z coordinate is close to 0)
    // Define a small epsilon for floating point comparison
    const epsilon = 1e-6;
    if (Math.abs(polyp.position.z) < epsilon) {
      // Recalculate horizontal normal pointing radially outwards
      // Ensure not to divide by zero if polyp is at (0,0,0)
      if (polyp.position.x === 0 && polyp.position.y === 0) {
        normal = { x: 0, y: 0, z: 0 }; // Or some default, though a base polyp shouldn't be at the origin if radius > 0
      } else {
        normal = normalizeVector({
          x: polyp.position.x,
          y: polyp.position.y,
          z: 0,
        });
      }
    } else {
      normal = {
        x: normalAttribute.getX(index),
        y: normalAttribute.getY(index),
        z: normalAttribute.getZ(index),
      };
    }
    return {
      ...polyp,
      normal,
    };
  });

  return {
    ...geometry,
    polyps: updatedPolyps,
  };
}
