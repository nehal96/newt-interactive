import Link from "next/link";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <Link href="/">
        <a className={styles.logo}>
          newt <span className={styles.notLogo}>interactive</span>
        </a>
      </Link>
    </nav>
  );
};

export default Navbar;
