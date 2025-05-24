import React, { useMemo } from "react";
import * as THREE from "three";
import { Sphere } from "@react-three/drei";

interface SeedCoralMeshProps {
  radius?: number;
  height?: number;
  color?: THREE.ColorRepresentation;
  showEdges?: boolean;
  edgeColor?: THREE.ColorRepresentation;
  showVertices?: boolean;
  vertexColor?: THREE.ColorRepresentation;
  vertexRadius?: number;
}

const SeedCoralMesh: React.FC<SeedCoralMeshProps> = ({
  radius = 1,
  height = 1.5,
  color = "coral",
  showEdges = true,
  edgeColor = "black",
  showVertices = true,
  vertexColor = "black",
  vertexRadius = 0.05,
}) => {
  const { pyramidGeometry, verticesArray } = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // Apex vertex
    const apex = [0, height, 0] as [number, number, number];

    // Base vertices (6 vertices for a hexagon on the XZ plane, y=0)
    const basePoints: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      basePoints.push([radius * Math.cos(angle), 0, radius * Math.sin(angle)]);
    }

    // Combine apex and base vertices into a single array
    // Vertices: V0 (apex), V1 (base_0), V2 (base_1), ..., V6 (base_5)
    const allVerticesCoords: [number, number, number][] = [apex, ...basePoints];
    const vertices = new Float32Array(allVerticesCoords.flat());
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    const indicesData = [];
    // Create 6 triangles for the sides of the pyramid
    // Each triangle connects the apex (vertex 0) to two adjacent base vertices
    for (let i = 0; i < 6; i++) {
      const baseVertexIndex1 = i + 1;
      const baseVertexIndex2 = ((i + 1) % 6) + 1; // Loop back to the first base vertex
      indicesData.push(0, baseVertexIndex1, baseVertexIndex2);
    }
    geo.setIndex(indicesData);
    geo.computeVertexNormals(); // Essential for correct lighting

    return { pyramidGeometry: geo, verticesArray: allVerticesCoords };
  }, [radius, height]);

  return (
    <group>
      <mesh geometry={pyramidGeometry} castShadow>
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {showEdges && (
        <lineSegments>
          <edgesGeometry args={[pyramidGeometry]} />
          <lineBasicMaterial color={edgeColor} />
        </lineSegments>
      )}
      {showVertices &&
        verticesArray.map((vertexPos, index) => (
          <Sphere
            key={index}
            args={[vertexRadius, 16, 16]}
            position={vertexPos}
          >
            <meshBasicMaterial color={vertexColor} />
          </Sphere>
        ))}
    </group>
  );
};

export default SeedCoralMesh;
