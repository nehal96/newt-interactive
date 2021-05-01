import { useState } from "react";
import { ArticleContainer, Input, Navbar, Title, Lede } from "../../components";
import MagicSquare from "./MagicSquare";
import styles from "./magic-squares.module.css";

function generate3x3MagicSquare(a: number, b: number, c: number) {
  return [
    [c - b, c + (a + b), c - a],
    [c - (a - b), c, c + (a - b)],
    [c + a, c - (a + b), c + b],
  ];
}

const MagicSquaresInteractive = () => {
  const [inputValues, setInputValues] = useState({
    a: 1,
    b: 3,
    c: 5,
  });

  const handleInputChange = (value, name) => {
    const val = !value || value === "" ? "" : Number(value);

    setInputValues({ ...inputValues, [name]: val });
  };

  const [squareValues, setSquareValues] = useState(
    generate3x3MagicSquare(inputValues.a, inputValues.b, inputValues.c)
  );

  return (
    <>
      <Navbar />
      <ArticleContainer>
        <Title>The Mystery of Magic Squares</Title>
        <Lede>An animated exploration of magic squares</Lede>
        <div className={styles["input-group"]}>
          {Object.keys(inputValues).map((name) => (
            <Input
              name={name}
              type="number"
              value={inputValues[name]}
              min={0}
              onChange={(e) => handleInputChange(e.target.value, e.target.name)}
              className={styles.input}
              withPrepend
              prependText={name}
              key={name}
            />
          ))}
        </div>

        <MagicSquare name="main" values={squareValues} withTotals={true} />
      </ArticleContainer>
    </>
  );
};

export default MagicSquaresInteractive;
