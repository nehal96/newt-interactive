import { useState } from "react";
import {
  ArticleContainer,
  Input,
  InputPrepend,
  InputWrapper,
  Navbar,
  Title,
  Lede,
} from "../../components";
import MagicSquare from "./MagicSquare";
// Helpers
import {
  generate3x3MagicSquare,
  validateVariables,
} from "./magic-squares.helpers";
// Styling
import styles from "./magic-squares.module.css";
// Types
import { VariableInputs } from "./types";

const MagicSquaresInteractive = () => {
  const [inputValues, setInputValues] = useState<VariableInputs>({
    a: {
      value: 1,
      hasBeenFocused: false,
      isValid: null,
    },
    b: {
      value: 3,
      hasBeenFocused: false,
      isValid: null,
    },
    c: {
      value: 5,
      hasBeenFocused: false,
      isValid: null,
    },
  });

  const handleInputChange = (value, name) => {
    const val = !value || value === "" ? "" : Number(value);

    setInputValues({
      ...inputValues,
      [name]: { ...inputValues[name], value: val },
    });
  };
  const handleInputFocus = (name) => {
    setInputValues({
      ...inputValues,
      [name]: { ...inputValues[name], hasBeenFocused: true },
    });
  };
  const handleInputBlur = () => {
    const validatedInputs = validateVariables(inputValues);
    setInputValues({
      ...validatedInputs,
    });
  };

  const [squareValues, setSquareValues] = useState(
    generate3x3MagicSquare(
      inputValues.a.value,
      inputValues.b.value,
      inputValues.c.value
    )
  );

  return (
    <>
      <Navbar />
      <ArticleContainer>
        <Title>The Mystery of Magic Squares</Title>
        <Lede>An animated exploration of magic squares</Lede>
        <div className={styles["input-group"]}>
          {Object.keys(inputValues).map((name) => (
            <InputWrapper key={name}>
              <InputPrepend isValid={inputValues[name].isValid}>
                {name}
              </InputPrepend>
              <Input
                name={name}
                type="number"
                value={inputValues[name].value}
                min={1}
                onChange={(e) =>
                  handleInputChange(e.target.value, e.target.name)
                }
                onFocus={(e) => handleInputFocus(e.target.name)}
                onBlur={(e) => handleInputBlur()}
                className={styles.input}
                isValid={inputValues[name].isValid}
                withPrepend
              />
            </InputWrapper>
          ))}
        </div>
        <MagicSquare name="main" values={squareValues} withTotals={true} />
      </ArticleContainer>
    </>
  );
};

export default MagicSquaresInteractive;
