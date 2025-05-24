import { CoralGeometry, Polyp, Vector3, Face } from "../types";

/**
 * Generates the initial coral seed geometry as a hexagonal pyramid (hexacone).
 * The apex is at (0, baseRadius, 0) (assuming Y is up).
 * The base is a hexagon on the XZ plane centered at (0, 0, 0).
 * @param baseRadius The radius of the hexagonal base.
 * @returns CoralGeometry object representing the hexacone.
 */
export function initializeCoralSeed(baseRadius: number): CoralGeometry {
  const polyps: Polyp[] = [];
  const faces: Face[] = [];

  // 1. Apex Polyp
  const apexPosition: Vector3 = { x: 0, y: baseRadius, z: 0 };
  polyps.push({ id: "p0", position: apexPosition });

  // 2. Base Polyps (hexagon on XZ plane, y=0)
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i; // 60 degrees for each segment
    const x = baseRadius * Math.cos(angle);
    const z = baseRadius * Math.sin(angle);
    polyps.push({ id: `p${i + 1}`, position: { x, y: 0, z } });
  }

  // Polyps array:
  // p0: apex
  // p1-p6: base polyps (p1 is at angle 0, p2 at 60 deg, etc.)

  // 3. Create Faces
  // 3.1. Side faces (triangles connecting apex to base edges)
  for (let i = 1; i <= 6; i++) {
    const basePolyp1Index = i;
    const basePolyp2Index = (i % 6) + 1; // Next base polyp, wraps around (p6 connects to p1)
    faces.push([0, basePolyp1Index, basePolyp2Index]); // Apex, base_i, base_i+1
  }

  // 3.2. Base faces (triangles forming the hexagonal base)
  // Connect p1 to the center (not strictly needed if we imagine a central point for base)
  // For simplicity, we can make two large triangles for the base, e.g., (p1,p2,p3) then (p1,p3,p4) is not good.
  // Let's use a fan from p1 for the base, e.g. (p1,p2,p3), (p1,p3,p4), (p1,p4,p5), (p1,p5,p6)
  faces.push([1, 2, 3]);
  faces.push([1, 3, 4]);
  faces.push([1, 4, 5]);
  faces.push([1, 5, 6]);

  // Normals and xi values will be calculated in a later step (Step 3 of plan)

  return {
    polyps,
    faces,
  };
}

// Example of how it might be used (and can be tested):
// const seed = initializeCoralSeed(10);
// console.log(JSON.stringify(seed, null, 2));
