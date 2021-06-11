import Link from "next/link";
import { useRouter } from "next/router";
import { SignInButton } from "../SignInButton/";
import { ActiveLink } from "../ActiveLink/";

import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <ActiveLink activeClassName={styles.active} prefetch href="/">
          <img
            src="/images/logo.svg"
            alt="ig.news logo"
            style={{ cursor: "pointer" }}
          />
        </ActiveLink>
        <nav>
          <ActiveLink activeClassName={styles.active} prefetch href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} prefetch href="/posts">
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
