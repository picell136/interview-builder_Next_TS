"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useGetWeakTopicsQuery } from "@/store/api/apiSlice";
import styles from "@/styles/Profile.module.css";

function getBarColor(percentage: number) {
  if (percentage >= 80) return "var(--color-success)";
  if (percentage >= 50) return "var(--color-warning)";
  return "var(--color-danger)";
}

export default function StatisticsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: stats = [] } = useGetWeakTopicsQuery(user?.id ?? "", {
    skip: !user,
  });

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!user) return null;

  const weakTopics = stats.filter((s) => s.percentage < 70);
  const strongTopics = stats.filter((s) => s.percentage >= 70);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Статистика слабых тем</h1>
      <p className={styles.subtitle}>
        Анализ по категориям на основе всех попыток
      </p>

      {stats.length === 0 ? (
        <div className={styles.empty}>
          Недостаточно данных. Пройдите хотя бы одно интервью.
        </div>
      ) : (
        <>
          {weakTopics.length > 0 && (
            <>
              <h2 className={styles.cardTitle} style={{ marginBottom: "1rem" }}>
                Слабые темы
              </h2>
              {weakTopics.map((stat) => (
                <div key={stat.category} className={styles.statBar}>
                  <div className={styles.statHeader}>
                    <span>{stat.category}</span>
                    <span>
                      {stat.correct}/{stat.total} ({stat.percentage}%)
                    </span>
                  </div>
                  <div className={styles.statBarTrack}>
                    <div
                      className={styles.statBarFill}
                      style={{
                        width: `${stat.percentage}%`,
                        background: getBarColor(stat.percentage),
                      }}
                    />
                  </div>
                  <div className={styles.weakLabel}>
                    Рекомендуется больше практики в этой категории
                  </div>
                </div>
              ))}
            </>
          )}

          {strongTopics.length > 0 && (
            <>
              <h2
                className={styles.cardTitle}
                style={{ marginTop: "2rem", marginBottom: "1rem" }}
              >
                Сильные темы
              </h2>
              {strongTopics.map((stat) => (
                <div key={stat.category} className={styles.statBar}>
                  <div className={styles.statHeader}>
                    <span>{stat.category}</span>
                    <span>
                      {stat.correct}/{stat.total} ({stat.percentage}%)
                    </span>
                  </div>
                  <div className={styles.statBarTrack}>
                    <div
                      className={styles.statBarFill}
                      style={{
                        width: `${stat.percentage}%`,
                        background: getBarColor(stat.percentage),
                      }}
                    />
                  </div>
                  <div className={styles.strongLabel}>Хороший результат</div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
