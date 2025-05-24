import React, { useMemo } from "react";
import * as THREE from "three";
import { Sphere } from "@react-three/drei";
import { CoralGeometry, Vector3 } from "./types"; // Assuming types.ts is in the same directory or adjust path

interface DynamicCoralMeshProps {
  geometry: CoralGeometry | null;
  color?: THREE.ColorRepresentation;
  showEdges?: boolean;
  edgeColor?: THREE.ColorRepresentation;
  showVertices?: boolean;
  vertexColor?: THREE.ColorRepresentation;
  vertexRadius?: number;
}

// Helper to convert our Vector3 to THREE.Vector3
const toThreeVector3 = (vec: Vector3) => new THREE.Vector3(vec.x, vec.y, vec.z);

const DynamicCoralMesh: React.FC<DynamicCoralMeshProps> = ({
  geometry,
  color = "lightgreen", // Changed color to differentiate from old SeedCoralMesh
  showEdges = true,
  edgeColor = "black",
  showVertices = true,
  vertexColor = "black",
  vertexRadius = 0.05,
}) => {
  const { threeGeometry, verticesArray } = useMemo(() => {
    if (!geometry || geometry.polyps.length === 0) {
      return { threeGeometry: new THREE.BufferGeometry(), verticesArray: [] };
    }

    const geo = new THREE.BufferGeometry();

    // Convert polyps to an array of coordinates for BufferAttribute
    const allVerticesCoords = geometry.polyps
      .map((p) => [p.position.x, p.position.y, p.position.z])
      .flat();
    const vertices = new Float32Array(allVerticesCoords);
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    // Set indices for faces
    if (geometry.faces.length > 0) {
      const indicesData = geometry.faces.flat();
      geo.setIndex(indicesData);
    }

    geo.computeVertexNormals(); // Essential for correct lighting and shading

    // For rendering spheres at vertex positions
    const vertsForSpheres = geometry.polyps.map((p) => p.position);

    return { threeGeometry: geo, verticesArray: vertsForSpheres };
  }, [geometry]);

  if (!geometry) {
    return null;
  }

  return (
    <group>
      {/* Render the main mesh */}
      {threeGeometry.attributes.position &&
        (threeGeometry.attributes.position as THREE.BufferAttribute).count >
          0 && (
          <mesh geometry={threeGeometry} castShadow receiveShadow>
            <meshStandardMaterial
              color={color}
              side={THREE.DoubleSide}
              flatShading={false}
            />
          </mesh>
        )}

      {/* Render edges if showEdges is true */}
      {showEdges && threeGeometry.index && (
        <lineSegments>
          <edgesGeometry args={[threeGeometry]} />
          <lineBasicMaterial color={edgeColor} />
        </lineSegments>
      )}

      {/* Render spheres at each polyp position if showVertices is true */}
      {showVertices &&
        verticesArray.map((vertexPos, index) => (
          <Sphere
            key={`polyp_sphere_${geometry.polyps[index]?.id || index}`}
            args={[vertexRadius, 16, 16]}
            position={toThreeVector3(vertexPos)}
          >
            <meshBasicMaterial color={vertexColor} />
          </Sphere>
        ))}
    </group>
  );
};

export default DynamicCoralMesh;
