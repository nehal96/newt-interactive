import { Polyp, Vector3, SimulationParameters, CoralGeometry } from "../types";
import { recalculatePolypNormals } from "./geometryUtils";
import { performPolypCloning, fuseCloseVertices } from "./polypCloning";

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
 * @param initialNormal The current surface normal for this polyp (assumed to be unit vector).
 * @param params The simulation parameters.
 * @returns The new position of the polyp. If no growth, returns the original position.
 */
export function calculatePolypGrowth(
  polyp: Polyp,
  initialNormal: Vector3,
  params: SimulationParameters
): Vector3 {
  let growthAttemptNormal = initialNormal;

  // If the polyp is not effectively at the origin:
  // Check if the initialNormal is pointing "inwards" relative to the polyp's position from the origin.
  // An "inward" normal would have a dot product with the position vector that is negative.
  const positionMagnitudeSq =
    polyp.position.x * polyp.position.x +
    polyp.position.y * polyp.position.y +
    polyp.position.z * polyp.position.z;

  if (positionMagnitudeSq > 1e-9) {
    // Avoid issues if polyp is at (0,0,0)
    const dotProductPositionNormal =
      polyp.position.x * initialNormal.x +
      polyp.position.y * initialNormal.y +
      polyp.position.z * initialNormal.z;

    if (dotProductPositionNormal < 0) {
      // Normal is pointing inwards, flip it for the growth attempt.
      growthAttemptNormal = {
        x: -initialNormal.x,
        y: -initialNormal.y,
        z: -initialNormal.z,
      };
    }
  }
  // Now, growthAttemptNormal is oriented "outwards" from the origin if a flip was needed,
  // or it's the original normal if it was already generally outward/tangential.

  // Calculate orientation factor xi based on this potentially reoriented normal.
  // calculateOrientationFactor will return 0 if growthAttemptNormal.z < 0.
  const xi = calculateOrientationFactor(growthAttemptNormal);

  // Store xi on the polyp if needed for visualization or other logic later
  // polyp.xi = xi; // This would modify the polyp; pure function should return new state

  if (xi >= params.s_min && xi <= params.s_max) {
    // Growth occurs
    const a = params.elongationRateV * params.deltaTime;
    const newPosition: Vector3 = {
      x: polyp.position.x + a * growthAttemptNormal.x,
      y: polyp.position.y + a * growthAttemptNormal.y,
      z: polyp.position.z + a * growthAttemptNormal.z,
    };
    return newPosition;
  }

  // No growth if xi condition not met
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
    const normal = polyp.normal || { x: 0, y: 0, z: 1 };
    const xi = calculateOrientationFactor(normal); // xi is calculated based on the normal
    const newPosition = calculatePolypGrowth(polyp, normal, params);

    return {
      ...polyp,
      position: newPosition,
      normal: normal,
      xi: xi, // Log the xi value that was used by calculatePolypGrowth's logic
    };
  });

  // Create intermediate geometry with updated positions but old normals
  const intermediateGeometry: CoralGeometry = {
    polyps: newPolyps,
    faces: currentGeometry.faces,
  };

  console.log("🔄 Performing polyp cloning (subdivision)...");

  // Step 2: Perform polyp cloning (subdivision) for edges that are too long
  const geometryAfterCloning = performPolypCloning(
    intermediateGeometry,
    params.subdivisionDistanceDeltaSub
  );

  console.log("🔄 Performing vertex fusion...");

  // Step 3: Fuse vertices that are too close together
  const geometryAfterFusion = fuseCloseVertices(
    geometryAfterCloning,
    params.subdivisionDistanceDeltaSub
  );

  console.log("🔄 Recalculating normals after position updates...");

  // Step 4: Recalculate normals based on new polyp positions using Three.js
  const finalGeometry = recalculatePolypNormals(geometryAfterFusion);

  console.log("✅ Simulation step complete");

  return finalGeometry;
}
