import { useRef } from "react";
import { CatmullRomCurve3, Vector3 } from "three";

const Helix = ({ curve, color = "#38ceff" }) => {
  const mesh = useRef();

  return (
    <mesh ref={mesh}>
      <tubeBufferGeometry args={[curve, 64, 0.4, 20, false]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const helix1Points = [];
const helix2Points = [];

// formula for helix: x = cos(i), y = sin(i), z = i
// second one is shifted upwards
for (let i = -5; i < 15; i++) {
  helix1Points.push(new Vector3(Math.cos(i), Math.sin(i), i));
  helix2Points.push(new Vector3(Math.cos(i), Math.sin(i), i + 2));
}

const DNAModel = () => {
  const helix1 = new CatmullRomCurve3(helix1Points);
  const helix2 = new CatmullRomCurve3(helix2Points);

  return (
    <>
      <ambientLight />
      <axesHelper args={[10]} />
      <Helix curve={helix1} />
      <Helix curve={helix2} color="#EF4444" />
    </>
  );
};

export default DNAModel;
