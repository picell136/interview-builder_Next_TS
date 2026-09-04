"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import styles from "@/styles/Header.module.css";

export default function Header() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        Interview<span>Builder</span>
      </Link>

      <nav className={styles.nav}>
        <Link href="/">Конструктор</Link>
        {isAuthenticated && (
          <>
            <Link href="/profile">Личный кабинет</Link>
            <Link href="/profile/history">История</Link>
            <Link href="/profile/favorites">Избранное</Link>
            <Link href="/profile/statistics">Статистика</Link>
          </>
        )}
      </nav>

      <div className={styles.userBlock}>
        {isAuthenticated && user ? (
          <>
            <span className={styles.userName}>{user.name}</span>
            <button className={styles.logoutBtn} onClick={() => dispatch(logout())}>
              Выйти
            </button>
          </>
        ) : (
          <div className={styles.authLinks}>
            <Link href="/login" className={styles.loginLink}>
              Войти
            </Link>
            <Link href="/register" className={styles.registerLink}>
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
