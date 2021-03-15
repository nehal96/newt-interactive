import styles from "./MagicSquare.module.css";

interface MagicSquare {
  n: Number;
}

const MagicSquare = ({ n }: MagicSquare) => {
  const nArray = new Array(n).fill(null);

  return (
    <table className={styles.grid}>
      <tbody>
        {nArray.map((elem, i) => (
          <tr key={i}>
            {nArray.map((elem, i) => (
              <td key={i} className={styles.cell}>
                {i + 1}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MagicSquare;
