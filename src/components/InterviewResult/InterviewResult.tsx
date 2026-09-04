"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetInterview } from "@/store/slices/interviewSlice";
import { useSaveAttemptMutation } from "@/store/api/apiSlice";
import styles from "@/styles/InterviewResult.module.css";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} мин ${s} сек`;
}

function getScoreColor(percentage: number): string {
  if (percentage >= 80) return "var(--color-success)";
  if (percentage >= 50) return "var(--color-warning)";
  return "var(--color-danger)";
}

export default function InterviewResult() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { config, answers, elapsedSeconds, questionIds } = useAppSelector(
    (s) => s.interview
  );
  const { user } = useAppSelector((s) => s.auth);
  const [saveAttempt] = useSaveAttemptMutation();

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const total = questionIds.length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const categoryStats = useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();
    for (const answer of answers) {
      const existing = map.get(answer.category) ?? { total: 0, correct: 0 };
      existing.total += 1;
      if (answer.isCorrect) existing.correct += 1;
      map.set(answer.category, existing);
    }
    return Array.from(map.entries()).map(([category, stats]) => ({
      category,
      ...stats,
      percentage: Math.round((stats.correct / stats.total) * 100),
    }));
  }, [answers]);

  useEffect(() => {
    if (!config || answers.length === 0) {
      router.replace("/");
      return;
    }

    if (user) {
      saveAttempt({
        userId: user.id,
        config,
        answers,
        score: correctCount,
        totalQuestions: total,
        durationSeconds: elapsedSeconds,
        completedAt: new Date().toISOString(),
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNewInterview = () => {
    dispatch(resetInterview());
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.scoreCircle}
        style={{ borderColor: getScoreColor(percentage) }}
      >
        <span className={styles.scoreValue} style={{ color: getScoreColor(percentage) }}>
          {percentage}%
        </span>
        <span className={styles.scoreLabel}>результат</span>
      </div>

      <h1 className={styles.title}>
        {percentage >= 80
          ? "Отличный результат!"
          : percentage >= 50
            ? "Неплохо, но есть над чем поработать"
            : "Нужно больше практики"}
      </h1>
      <p className={styles.subtitle}>
        Вы ответили правильно на {correctCount} из {total} вопросов
      </p>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{correctCount}/{total}</div>
          <div className={styles.statLabel}>Правильных ответов</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatTime(elapsedSeconds)}</div>
          <div className={styles.statLabel}>Время</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{config?.role}</div>
          <div className={styles.statLabel}>Направление</div>
        </div>
      </div>

      {categoryStats.length > 0 && (
        <div className={styles.categoryBreakdown}>
          <h3 className={styles.categoryTitle}>По категориям</h3>
          {categoryStats.map((cat) => (
            <div key={cat.category}>
              <div className={styles.categoryItem}>
                <span className={styles.categoryName}>{cat.category}</span>
                <span
                  className={styles.categoryScore}
                  style={{ color: getScoreColor(cat.percentage) }}
                >
                  {cat.correct}/{cat.total} ({cat.percentage}%)
                </span>
              </div>
              <div className={styles.categoryBar}>
                <div
                  className={styles.categoryBarFill}
                  style={{
                    width: `${cat.percentage}%`,
                    background: getScoreColor(cat.percentage),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleNewInterview}>
          Новое интервью
        </button>
        <Link href="/profile/statistics" className={`${styles.btn} ${styles.btnSecondary}`}>
          Статистика
        </Link>
      </div>
    </div>
  );
}
