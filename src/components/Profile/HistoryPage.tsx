"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useGetAttemptsQuery } from "@/store/api/apiSlice";
import { ROLES, LEVELS } from "@/data/questions";
import styles from "@/styles/Profile.module.css";

function getBadgeClass(percentage: number) {
  if (percentage >= 80) return styles.badgeGood;
  if (percentage >= 50) return styles.badgeMedium;
  return styles.badgeBad;
}

export default function HistoryPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: attempts = [] } = useGetAttemptsQuery(user?.id ?? "", {
    skip: !user,
  });

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!user) return null;

  const roleLabel = (value: string) =>
    ROLES.find((r) => r.value === value)?.label ?? value;
  const levelLabel = (value: string) =>
    LEVELS.find((l) => l.value === value)?.label ?? value;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>История попыток</h1>
      <p className={styles.subtitle}>Все пройденные интервью</p>

      {attempts.length === 0 ? (
        <div className={styles.empty}>
          Вы ещё не проходили интервью.{" "}
          <a href="/">Начните первое!</a>
        </div>
      ) : (
        <div className={styles.list}>
          {attempts.map((attempt) => {
            const pct = Math.round(
              (attempt.score / attempt.totalQuestions) * 100
            );
            const date = new Date(attempt.completedAt).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div key={attempt.id} className={styles.listItem}>
                <div className={styles.listItemLeft}>
                  <div className={styles.listItemTitle}>
                    {roleLabel(attempt.config.role)} — {levelLabel(attempt.config.level)}
                  </div>
                  <div className={styles.listItemMeta}>
                    {date} · {attempt.score}/{attempt.totalQuestions} правильных ·{" "}
                    {Math.floor(attempt.durationSeconds / 60)} мин
                  </div>
                </div>
                <span className={`${styles.badge} ${getBadgeClass(pct)}`}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
