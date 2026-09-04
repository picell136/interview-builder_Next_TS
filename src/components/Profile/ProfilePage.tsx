"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useGetAttemptsQuery } from "@/store/api/apiSlice";
import styles from "@/styles/Profile.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: attempts = [] } = useGetAttemptsQuery(user?.id ?? "", {
    skip: !user,
  });

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!user) return null;

  const totalAttempts = attempts.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) /
            totalAttempts
        )
      : 0;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Личный кабинет</h1>
      <p className={styles.subtitle}>Добро пожаловать, {user.name}</p>

      <div className={styles.info}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Имя</span>
          <span className={styles.infoValue}>{user.name}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email</span>
          <span className={styles.infoValue}>{user.email}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Попыток</span>
          <span className={styles.infoValue}>{totalAttempts}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Средний балл</span>
          <span className={styles.infoValue}>{avgScore}%</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>История попыток</div>
          <div className={styles.cardDesc}>
            Просмотрите все пройденные интервью и результаты
          </div>
          <Link href="/profile/history" className={styles.cardLink}>
            Открыть →
          </Link>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Избранные вопросы</div>
          <div className={styles.cardDesc}>
            Вопросы, которые вы сохранили для повторения
          </div>
          <Link href="/profile/favorites" className={styles.cardLink}>
            Открыть →
          </Link>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Статистика слабых тем</div>
          <div className={styles.cardDesc}>
            Анализ категорий, где нужно больше практики
          </div>
          <Link href="/profile/statistics" className={styles.cardLink}>
            Открыть →
          </Link>
        </div>
      </div>
    </div>
  );
}
