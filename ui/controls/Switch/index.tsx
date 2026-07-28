import * as SwitchPrimitive from "@radix-ui/react-switch";
import { FunctionComponent, RefAttributes } from "react";
import styles from "./Switch.module.css";

const Switch: FunctionComponent<
  SwitchPrimitive.SwitchProps & RefAttributes<HTMLButtonElement>
> = (props) => {
  return (
    <SwitchPrimitive.Root className={styles["switch-root"]} {...props}>
      <SwitchPrimitive.Thumb className={styles["switch-thumb"]} />
    </SwitchPrimitive.Root>
  );
};

export default Switch;
