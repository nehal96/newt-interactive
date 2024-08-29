import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { PDBLoader } from "three/examples/jsm/loaders/PDBLoader";
import * as THREE from "three";

const HemoglobinModel = () => {
  const { scene } = useThree();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = new PDBLoader();
    loader.load(
      // 'https://files.rcsb.org/view/1GZX.pdb',
      "https://files.rcsb.org/view/1VWT.pdb",
      (pdb) => {
        const geometryAtoms = pdb.geometryAtoms;
        const geometryBonds = pdb.geometryBonds;

        const atomsMesh = new THREE.Points(
          geometryAtoms,
          new THREE.PointsMaterial({ vertexColors: true })
        );
        const bondsMesh = new THREE.LineSegments(
          geometryBonds,
          new THREE.LineBasicMaterial({ vertexColors: true })
        );

        const mol = new THREE.Group();
        mol.add(atomsMesh);
        mol.add(bondsMesh);
        scene.add(mol);

        setLoading(false);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("An error occurred while loading the PDB file:", error);
      }
    );
  }, [scene]);

  return loading ? <Html center>Loading Hemoglobin...</Html> : null;
};

export default HemoglobinModel;
