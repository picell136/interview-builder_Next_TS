"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  initBuilder,
  setBuilderRole,
  setBuilderLevel,
  toggleBuilderTechnology,
  toggleBuilderCategory,
  startInterview,
} from "@/store/slices/interviewSlice";
import { useGetQuestionsQuery } from "@/store/api/apiSlice";
import {
  ROLES,
  LEVELS,
  CATEGORIES,
  INTERVIEW_QUESTION_COUNT,
  getTechnologiesForRole,
} from "@/data/questions";
import type { Role, Level, Technology } from "@/types";
import styles from "@/styles/InterviewBuilder.module.css";

export default function InterviewBuilder() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { config } = useAppSelector((s) => s.interview);
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(initBuilder());
  }, [dispatch]);

  const canFetch =
    config &&
    config.technologies.length > 0 &&
    config.categories.length > 0;

  const { data: previewQuestions } = useGetQuestionsQuery(config!, {
    skip: !canFetch,
  });

  const availableTechs = config ? getTechnologiesForRole(config.role) : [];

  const handleStart = () => {
    if (!config || !previewQuestions || previewQuestions.length < INTERVIEW_QUESTION_COUNT)
      return;
    const selected = previewQuestions.slice(0, INTERVIEW_QUESTION_COUNT);
    dispatch(
      startInterview({
        config: { ...config, questionCount: INTERVIEW_QUESTION_COUNT },
        questionIds: selected.map((q) => q.id),
      })
    );
    router.push("/interview");
  };

  if (!config) return null;

  const isReady =
    isAuthenticated &&
    config.technologies.length > 0 &&
    config.categories.length > 0 &&
    previewQuestions &&
    previewQuestions.length >= INTERVIEW_QUESTION_COUNT;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Конструктор интервью</h1>
      <p className={styles.subtitle}>
        Выберите направление, уровень, технологии и категории вопросов
      </p>

      {!isAuthenticated && (
        <div className={styles.authPrompt}>
          <Link href="/login">Войдите</Link> или{" "}
          <Link href="/register">зарегистрируйтесь</Link>, чтобы начать интервью
        </div>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.stepNumber}>1</span>
          Направление
        </h2>
        <div className={styles.grid}>
          {ROLES.map((role) => (
            <button
              key={role.value}
              className={`${styles.card} ${config.role === role.value ? styles.cardActive : ""}`}
              onClick={() => dispatch(setBuilderRole(role.value as Role))}
            >
              <div className={styles.cardTitle}>{role.label}</div>
              <div className={styles.cardDesc}>{role.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.stepNumber}>2</span>
          Уровень
        </h2>
        <div className={styles.chips}>
          {LEVELS.map((level) => (
            <button
              key={level.value}
              className={`${styles.chip} ${config.level === level.value ? styles.chipActive : ""}`}
              onClick={() => dispatch(setBuilderLevel(level.value as Level))}
            >
              {level.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.stepNumber}>3</span>
          Технологии
        </h2>
        <div className={styles.chips}>
          {availableTechs.map((tech) => (
            <button
              key={tech.value}
              className={`${styles.chip} ${config.technologies.includes(tech.value as Technology) ? styles.chipActive : ""}`}
              onClick={() => dispatch(toggleBuilderTechnology(tech.value as Technology))}
            >
              {tech.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.stepNumber}>4</span>
          Категории вопросов
        </h2>
        <div className={styles.chips}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.chip} ${config.categories.includes(cat) ? styles.chipActive : ""}`}
              onClick={() => dispatch(toggleBuilderCategory(cat))}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {canFetch && previewQuestions && (
        <p className={styles.warning}>
          В банке по фильтрам: {previewQuestions.length}. В интервью будет{" "}
          {Math.min(INTERVIEW_QUESTION_COUNT, previewQuestions.length)} вопросов
          {previewQuestions.length < INTERVIEW_QUESTION_COUNT &&
            " — выберите больше технологий или категорий"}
          {previewQuestions.length === 0 && " — попробуйте другие настройки"}
        </p>
      )}

      <button
        className={styles.startBtn}
        disabled={!isReady}
        onClick={handleStart}
      >
        Начать интервью ({INTERVIEW_QUESTION_COUNT} вопросов)
      </button>
    </div>
  );
}
