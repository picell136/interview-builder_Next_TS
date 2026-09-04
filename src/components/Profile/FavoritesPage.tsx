"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useGetFavoritesQuery, useToggleFavoriteMutation } from "@/store/api/apiSlice";
import { QUESTIONS } from "@/data/questions";
import styles from "@/styles/Profile.module.css";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: favoriteIds = [] } = useGetFavoritesQuery(user?.id ?? "", {
    skip: !user,
  });
  const [toggleFavorite] = useToggleFavoriteMutation();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!user) return null;

  const favoriteQuestions = QUESTIONS.filter((q) => favoriteIds.includes(q.id));

  const handleRemove = async (questionId: string) => {
    await toggleFavorite({ userId: user.id, questionId });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Избранные вопросы</h1>
      <p className={styles.subtitle}>
        {favoriteQuestions.length} вопросов сохранено
      </p>

      {favoriteQuestions.length === 0 ? (
        <div className={styles.empty}>
          Нет избранных вопросов. Добавляйте вопросы во время прохождения интервью.
        </div>
      ) : (
        <div className={styles.list}>
          {favoriteQuestions.map((q) => (
            <div key={q.id} className={styles.listItem}>
              <div className={styles.listItemLeft}>
                <div className={styles.questionText}>{q.text}</div>
                <div className={styles.questionCategory}>
                  {q.category} · {q.role} · {q.level}
                </div>
              </div>
              <button
                className={styles.removeBtn}
                onClick={() => handleRemove(q.id)}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
