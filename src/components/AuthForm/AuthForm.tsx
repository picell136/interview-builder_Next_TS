"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import { useLoginMutation, useRegisterMutation } from "@/store/api/apiSlice";
import styles from "@/styles/AuthForm.module.css";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const isLoading = loginLoading || registerLoading;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const result = await login({ email, password }).unwrap();
        dispatch(setUser(result));
      } else {
        const result = await register({ email, password, name }).unwrap();
        dispatch(setUser(result));
      }
      router.push("/");
    } catch (err: unknown) {
      const apiError = err as { data?: string };
      setError(apiError.data ?? "Произошла ошибка");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {mode === "login" ? "Вход" : "Регистрация"}
        </h1>
        <p className={styles.subtitle}>
          {mode === "login"
            ? "Войдите, чтобы проходить интервью"
            : "Создайте аккаунт для начала подготовки"}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className={styles.field}>
              <label htmlFor="name">Имя</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading
              ? "Загрузка..."
              : mode === "login"
                ? "Войти"
                : "Зарегистрироваться"}
          </button>
        </form>

        <p className={styles.footer}>
          {mode === "login" ? (
            <>
              Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
            </>
          ) : (
            <>
              Уже есть аккаунт? <Link href="/login">Войти</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
