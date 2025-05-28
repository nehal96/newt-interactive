import { Polyp, Vector3, SimulationParameters, CoralGeometry } from "../types";
import { recalculatePolypNormals } from "./geometryUtils";

/**
 * Calculates the orientation factor (xi) for a polyp based on its surface normal.
 * The paper defines xi = (1/PI) * arctan(nz / sqrt(nx^2 + ny^2)), with the intention
 * that xi = 1 for a purely vertical normal (nz=1) and xi = 0 for a purely horizontal normal (nz=0).
 * This implementation interprets xi as the normalized angle of elevation from the XY plane,
 * for normals with a non-negative z component.
 * Assumes the normal vector is unitary.
 *
 * @param normal The surface normal vector of the polyp (assumed to be unit vector).
 * @returns The orientation factor xi, ranging from 0 (horizontal) to 1 (vertical upwards).
 */
export function calculateOrientationFactor(normal: Vector3): number {
  const { x: nx, y: ny, z: nz } = normal;

  // Polyps with normals pointing downwards (nz < 0) have xi = 0 (no growth).
  if (nz < 0) {
    return 0;
  }

  const horizontalMagnitude = Math.sqrt(nx * nx + ny * ny);

  // If the horizontal magnitude is negligible, the normal is essentially vertical.
  if (horizontalMagnitude < 1e-9) {
    return nz > 0 ? 1.0 : 0.0; // 1.0 if pointing up, 0.0 if pointing straight down (or if nz is also 0)
  }

  // Calculate the angle of elevation from the XY plane.
  // This angle is in radians, ranging from 0 (horizontal) to PI/2 (vertical up).
  const angleWithXYPlane = Math.atan(nz / horizontalMagnitude);

  // Normalize this angle to the range [0, 1].
  // (angle / (PI/2)) = (2 * angle) / PI.
  // Ensure result is not negative due to potential floating point inaccuracies if nz was very slightly negative but passed the initial check.
  return Math.max(0, (2 * angleWithXYPlane) / Math.PI);
}

/**
 * Updates a single polyp's position based on surface growth rules.
 *
 * @param polyp The polyp to update.
 * @param normal The current surface normal for this polyp (assumed to be unit vector).
 * @param params The simulation parameters.
 * @returns The new position of the polyp. If no growth, returns the original position.
 */
export function calculatePolypGrowth(
  polyp: Polyp,
  normal: Vector3, // Assuming normal is pre-calculated and passed in for now
  params: SimulationParameters
): Vector3 {
  const xi = calculateOrientationFactor(normal);

  // Store xi on the polyp if needed for visualization or other logic later
  // polyp.xi = xi; // This would modify the polyp; pure function should return new state

  if (xi >= params.s_min && xi <= params.s_max) {
    // Growth occurs
    const a = params.elongationRateV * params.deltaTime;
    const newPosition: Vector3 = {
      x: polyp.position.x + a * normal.x,
      y: polyp.position.y + a * normal.y,
      z: polyp.position.z + a * normal.z,
    };
    return newPosition;
  }

  // No growth
  return polyp.position;
}

// Helper function for vector operations (can be expanded)
export function addVectors(v1: Vector3, v2: Vector3): Vector3 {
  return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
}

export function scaleVector(v: Vector3, scalar: number): Vector3 {
  return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
}

/**
 * Runs a single step of the coral growth simulation.
 *
 * @param currentGeometry The current state of the coral geometry (polyps and faces).
 * @param params The simulation parameters.
 * @returns A new CoralGeometry object representing the state after one simulation step.
 */
export function runSimulationStep(
  currentGeometry: CoralGeometry,
  params: SimulationParameters
): CoralGeometry {
  const newPolyps = currentGeometry.polyps.map((polyp) => {
    // Use the polyp's own normal if it exists, otherwise default.
    // createSeedCoralGeometry should provide normals.
    const normal = polyp.normal || { x: 0, y: 0, z: 1 }; // Default if no normal provided

    // Ensure the normal is a unit vector before use, or ensure calculateOrientationFactor can handle non-unit normals / normalize internally.
    // For now, assuming normals from createSeedCoralGeometry are unit vectors.

    const xi = calculateOrientationFactor(normal);
    const newPosition = calculatePolypGrowth(polyp, normal, params);

    return {
      ...polyp,
      position: newPosition,
      normal: normal, // Keep the normal used for this step's calculation
      xi: xi,
    };
  });

  // Create intermediate geometry with updated positions but old normals
  const intermediateGeometry: CoralGeometry = {
    polyps: newPolyps,
    faces: currentGeometry.faces,
  };

  console.log("🔄 Recalculating normals after position updates...");

  // Recalculate normals based on new polyp positions using Three.js
  const finalGeometry = recalculatePolypNormals(intermediateGeometry);

  console.log("✅ Normal recalculation complete");

  return finalGeometry;
}
