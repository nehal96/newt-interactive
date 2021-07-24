import Link from "next/link";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/">
          <a className={styles.logo}>
            newt <span className={styles.notLogo}>interactive</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
