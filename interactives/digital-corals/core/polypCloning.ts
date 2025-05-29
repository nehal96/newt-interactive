import { Vector3, Polyp, Face, CoralGeometry } from "../types";

// Helper function to calculate the Euclidean distance between two 3D points
function calculateDistance(p1: Vector3, p2: Vector3): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Helper function to calculate the midpoint between two 3D points
function calculateMidpoint(p1: Vector3, p2: Vector3): Vector3 {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
    z: (p1.z + p2.z) / 2,
  };
}

// Helper function to generate a unique ID for a new polyp
function generatePolypId(baseId: string = "polyp_clone"): string {
  return `${baseId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Copied from geometryUtils.ts for use in fuseCloseVertices winding check
function calculateFaceNormal(p1: Vector3, p2: Vector3, p3: Vector3): Vector3 {
  const U: Vector3 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
  const V: Vector3 = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };

  const N: Vector3 = {
    x: U.y * V.z - U.z * V.y,
    y: U.z * V.x - U.x * V.z,
    z: U.x * V.y - U.y * V.x,
  };

  const length = Math.sqrt(N.x * N.x + N.y * N.y + N.z * N.z);
  if (length < 1e-9) return { x: 0, y: 0, z: 1 }; // Avoid division by zero for degenerate or near-degenerate faces
  return { x: N.x / length, y: N.y / length, z: N.z / length };
}

// Helper function for vector dot product
function dotProduct(v1: Vector3, v2: Vector3): number {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

// Represents an edge in the mesh by its two vertex indices and length
export interface Edge {
  vertex1: number;
  vertex2: number;
  length: number;
}

/**
 * Extracts all unique edges from the mesh faces and calculates their lengths.
 */
export function extractEdges(geometry: CoralGeometry): Edge[] {
  const edgeMap = new Map<string, Edge>(); // Key: "v1-v2" (sorted indices)

  for (const face of geometry.faces) {
    const edgesInFace: [number, number][] = [
      [face[0], face[1]],
      [face[1], face[2]],
      [face[2], face[0]],
    ];

    for (const [u, v] of edgesInFace) {
      const v1 = Math.min(u, v);
      const v2 = Math.max(u, v);
      const edgeKey = `${v1}-${v2}`;

      if (!edgeMap.has(edgeKey)) {
        const p1 = geometry.polyps[v1].position;
        const p2 = geometry.polyps[v2].position;
        edgeMap.set(edgeKey, {
          vertex1: v1,
          vertex2: v2,
          length: calculateDistance(p1, p2),
        });
      }
    }
  }
  return Array.from(edgeMap.values());
}

/**
 * Finds edges that exceed the subdivision distance threshold.
 */
export function findLongEdges(
  edges: Edge[],
  subdivisionDistance: number
): Edge[] {
  return edges.filter((edge) => edge.length > subdivisionDistance);
}

// Helper function to create a consistent key for an edge's original vertices
function getOriginalEdgeKey(v1: number, v2: number): string {
  return v1 < v2 ? `${v1}-${v2}` : `${v2}-${v1}`;
}

/**
 * Performs polyp cloning by subdividing all qualifying edges identified from the initial geometry.
 * This is a batch operation: all decisions are made based on the geometry state at the
 * beginning of the function call.
 */
export function performPolypCloning(
  geometry: CoralGeometry,
  subdivisionDistance: number
): CoralGeometry {
  const initialEdges = extractEdges(geometry);
  const edgesToSubdivide = findLongEdges(initialEdges, subdivisionDistance);

  if (edgesToSubdivide.length === 0) {
    // console.log("ℹ️ Polyp cloning: No edges long enough to subdivide in this step.");
    return geometry;
  }

  console.log(
    `🔄 Polyp cloning: Found ${edgesToSubdivide.length} edges to subdivide (batch operation).`
  );

  const newPolypPropsList: Array<{
    id: string;
    position: Vector3;
    normal: Vector3 | undefined;
  }> = [];
  // Maps string edge key ("v1original-v2original") to the FINAL INDEX of the new polyp in the combined polyps array
  const originalEdgeKeyToNewPolypFinalIndex = new Map<string, number>();

  // 1. Plan all new polyps and their properties + final indices
  for (let i = 0; i < edgesToSubdivide.length; i++) {
    const edge = edgesToSubdivide[i];
    const p1 = geometry.polyps[edge.vertex1];
    const p2 = geometry.polyps[edge.vertex2];

    const newPosition = calculateMidpoint(p1.position, p2.position);
    // Normals for new polyps will be calculated in the main simulation loop's recalculatePolypNormals step.
    // So, we can set normal to undefined here.
    const newPolypData = {
      id: generatePolypId(`polyp_batch_${i}`),
      position: newPosition,
      normal: undefined, // To be set by recalculatePolypNormals
    };
    newPolypPropsList.push(newPolypData);

    const originalEdgeKey = getOriginalEdgeKey(edge.vertex1, edge.vertex2);
    // The final index will be the original polyp count + the 0-based index in newPolypPropsList
    originalEdgeKeyToNewPolypFinalIndex.set(
      originalEdgeKey,
      geometry.polyps.length + i
    );
  }

  // 2. Construct the final list of all polyps (original + new)
  const finalPolyps: Polyp[] = [...geometry.polyps];
  for (const props of newPolypPropsList) {
    finalPolyps.push(props);
  }

  // 3. Reconstruct faces based on which original edges were split
  const finalFaces: Face[] = [];
  for (const originalFace of geometry.faces) {
    const [vA, vB, vC] = originalFace; // Original indices

    const keyAB = getOriginalEdgeKey(vA, vB);
    const keyBC = getOriginalEdgeKey(vB, vC);
    const keyCA = getOriginalEdgeKey(vC, vA);

    const mAB_finalIdx = originalEdgeKeyToNewPolypFinalIndex.get(keyAB);
    const mBC_finalIdx = originalEdgeKeyToNewPolypFinalIndex.get(keyBC);
    const mCA_finalIdx = originalEdgeKeyToNewPolypFinalIndex.get(keyCA);

    const splitCount =
      (mAB_finalIdx !== undefined ? 1 : 0) +
      (mBC_finalIdx !== undefined ? 1 : 0) +
      (mCA_finalIdx !== undefined ? 1 : 0);

    if (splitCount === 0) {
      finalFaces.push([vA, vB, vC]);
    } else if (splitCount === 1) {
      if (mAB_finalIdx !== undefined) {
        // Edge A-B was split
        finalFaces.push([vA, mAB_finalIdx, vC]);
        finalFaces.push([mAB_finalIdx, vB, vC]);
      } else if (mBC_finalIdx !== undefined) {
        // Edge B-C was split
        finalFaces.push([vA, vB, mBC_finalIdx]);
        finalFaces.push([vA, mBC_finalIdx, vC]);
      } else {
        // Edge C-A was split (mCA_finalIdx !== undefined)
        finalFaces.push([vB, vC, mCA_finalIdx]);
        finalFaces.push([vB, mCA_finalIdx, vA]);
      }
    } else if (splitCount === 2) {
      if (mAB_finalIdx !== undefined && mBC_finalIdx !== undefined) {
        // A-B and B-C split
        finalFaces.push([vA, mAB_finalIdx, vC]);
        finalFaces.push([mAB_finalIdx, vB, mBC_finalIdx]);
        finalFaces.push([vC, mBC_finalIdx, mAB_finalIdx]);
      } else if (mBC_finalIdx !== undefined && mCA_finalIdx !== undefined) {
        // B-C and C-A split
        finalFaces.push([vB, mBC_finalIdx, vA]);
        finalFaces.push([mBC_finalIdx, vC, mCA_finalIdx]);
        finalFaces.push([vA, mCA_finalIdx, mBC_finalIdx]);
      } else {
        // C-A and A-B split (mCA_finalIdx !== undefined && mAB_finalIdx !== undefined)
        finalFaces.push([vC, mCA_finalIdx, vB]);
        finalFaces.push([mCA_finalIdx, vA, mAB_finalIdx]);
        finalFaces.push([vB, mAB_finalIdx, mCA_finalIdx]);
      }
    } else if (splitCount === 3) {
      // All three edges split
      finalFaces.push([vA, mAB_finalIdx, mCA_finalIdx]);
      finalFaces.push([vB, mBC_finalIdx, mAB_finalIdx]);
      finalFaces.push([vC, mCA_finalIdx, mBC_finalIdx]);
      finalFaces.push([mAB_finalIdx, mBC_finalIdx, mCA_finalIdx]); // Central triangle
    }
  }

  console.log(
    `✅ Polyp batch cloning complete: Added ${newPolypPropsList.length} new polyps. ` +
      `Initial polyps: ${geometry.polyps.length}, Final polyps: ${finalPolyps.length}. ` +
      `Initial faces: ${geometry.faces.length}, Final faces: ${finalFaces.length}.`
  );

  return {
    polyps: finalPolyps,
    faces: finalFaces,
  };
}

// The old iterative subdivideEdge and parts of the old performPolypCloning are no longer needed.
// Keeping fuseCloseVertices as it's a separate mechanism.

/**
 * Fuses vertices that are too close together (< 0.3 * subdivisionDistance currently)
 * This is part of the self-regulation mechanism described in the paper
 */
export function fuseCloseVertices(
  geometry: CoralGeometry,
  subdivisionDistance: number // Used to calculate fusionThreshold
): CoralGeometry {
  const fusionThreshold = 0.3 * subdivisionDistance; // User changed from 0.2
  if (fusionThreshold <= 1e-9) return geometry; // Avoid issues with non-positive or negligible threshold

  const polypsToRemove = new Set<number>();
  const fuseTargetMap = new Map<number, number>();

  for (let i = geometry.polyps.length - 1; i >= 0; i--) {
    if (polypsToRemove.has(i)) continue;
    for (let j = i - 1; j >= 0; j--) {
      if (polypsToRemove.has(j) || fuseTargetMap.has(j)) continue; // Also skip if j is already a target

      const distance = calculateDistance(
        geometry.polyps[i].position,
        geometry.polyps[j].position
      );

      if (distance < fusionThreshold) {
        polypsToRemove.add(i);
        fuseTargetMap.set(i, j);
        break;
      }
    }
  }

  if (polypsToRemove.size === 0) {
    return geometry;
  }
  console.log(
    `🔗 Vertex fusion: Identified ${polypsToRemove.size} polyps to fuse.`
  );

  let changedInPass: boolean;
  do {
    changedInPass = false;
    for (const [polypToRemove, mapsTo] of Array.from(fuseTargetMap.entries())) {
      const ultimateTarget = fuseTargetMap.get(mapsTo);
      if (ultimateTarget !== undefined) {
        if (fuseTargetMap.get(polypToRemove) !== ultimateTarget) {
          fuseTargetMap.set(polypToRemove, ultimateTarget);
          changedInPass = true;
        }
      }
    }
  } while (changedInPass);

  const finalPolyps: Polyp[] = [];
  const originalToFinalIndexMap = new Map<number, number>();
  let currentFinalIndex = 0;

  for (let i = 0; i < geometry.polyps.length; i++) {
    if (polypsToRemove.has(i)) {
      continue;
    }
    finalPolyps.push(geometry.polyps[i]);
    originalToFinalIndexMap.set(i, currentFinalIndex);
    currentFinalIndex++;
  }

  for (const removedPolypOriginalIndex of Array.from(polypsToRemove)) {
    const fusionTargetOriginalIndex = fuseTargetMap.get(
      removedPolypOriginalIndex
    );
    if (fusionTargetOriginalIndex === undefined) {
      console.error(
        `Error: Polyp ${removedPolypOriginalIndex} marked for removal but no fusion target found.`
      );
      continue;
    }
    const fusionTargetFinalIndex = originalToFinalIndexMap.get(
      fusionTargetOriginalIndex
    );
    if (fusionTargetFinalIndex === undefined) {
      console.error(
        `Error: Fusion target ${fusionTargetOriginalIndex} for polyp ${removedPolypOriginalIndex} not found in final map.`
      );
      continue;
    }
    originalToFinalIndexMap.set(
      removedPolypOriginalIndex,
      fusionTargetFinalIndex
    );
  }

  const finalFaces: Face[] = [];
  const seenFaces = new Set<string>();

  for (const originalFace of geometry.faces) {
    const [o1, o2, o3] = originalFace;
    const u_idx = originalToFinalIndexMap.get(o1);
    const v_idx = originalToFinalIndexMap.get(o2);
    const w_idx = originalToFinalIndexMap.get(o3);

    if (u_idx === undefined || v_idx === undefined || w_idx === undefined) {
      // console.warn("Skipping face due to unresolved polyp index during fusion (original face):", originalFace);
      continue;
    }

    if (u_idx === v_idx || u_idx === w_idx || v_idx === w_idx) {
      // console.log(`Skipping degenerate face after fusion: [${u_idx}, ${v_idx}, ${w_idx}] (original: ${originalFace})`);
      continue;
    }

    // Get positions for normal calculation
    const p_o1 = geometry.polyps[o1].position;
    const p_o2 = geometry.polyps[o2].position;
    const p_o3 = geometry.polyps[o3].position;

    const p_u = finalPolyps[u_idx].position;
    const p_v = finalPolyps[v_idx].position;
    const p_w = finalPolyps[w_idx].position;

    // Calculate normal of original face (ensure it's not degenerate first)
    // Check if original points are co-linear (very basic check for area)
    const origAreaCheck =
      (p_o2.x - p_o1.x) * (p_o3.y - p_o1.y) -
      (p_o2.y - p_o1.y) * (p_o3.x - p_o1.x);
    if (
      Math.abs(origAreaCheck) < 1e-9 &&
      p_o1.z === p_o2.z &&
      p_o1.z === p_o3.z
    ) {
      // crude check for co-linearity on a plane
      // Potentially degenerate original face, skip trying to get its normal or assume a default
      // console.warn("Original face appears degenerate, skipping normal comparison:", originalFace);
    } else {
      const normalOriginal = calculateFaceNormal(p_o1, p_o2, p_o3);
      const normalCandidate = calculateFaceNormal(p_u, p_v, p_w);

      if (dotProduct(normalOriginal, normalCandidate) < 0) {
        // Flipped winding, reverse the candidate face
        const correctedFace: Face = [u_idx, w_idx, v_idx];
        const sortedFaceKey = [...correctedFace]
          .sort((a, b) => a - b)
          .join("-");
        if (!seenFaces.has(sortedFaceKey)) {
          finalFaces.push(correctedFace);
          seenFaces.add(sortedFaceKey);
        }
        continue; // Go to next originalFace
      }
    }

    // If not flipped (or original was degenerate), proceed with [u_idx, v_idx, w_idx]
    const finalFaceCandidate: Face = [u_idx, v_idx, w_idx];
    const sortedFaceKey = [...finalFaceCandidate]
      .sort((a, b) => a - b)
      .join("-");
    if (!seenFaces.has(sortedFaceKey)) {
      finalFaces.push(finalFaceCandidate);
      seenFaces.add(sortedFaceKey);
    }
  }

  console.log(
    `✅ Vertex fusion complete: Fused ${polypsToRemove.size} polyps. ` +
      `Initial polyps: ${geometry.polyps.length}, Final polyps: ${finalPolyps.length}. ` +
      `Initial faces: ${geometry.faces.length}, Final faces: ${finalFaces.length}.`
  );

  return {
    polyps: finalPolyps,
    faces: finalFaces,
  };
}
