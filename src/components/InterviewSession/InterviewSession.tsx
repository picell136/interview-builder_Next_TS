"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  answerQuestion,
  nextQuestion,
  tickTimer,
  finishInterview,
} from "@/store/slices/interviewSlice";
import { useGetQuestionByIdQuery, useToggleFavoriteMutation, useGetFavoritesQuery } from "@/store/api/apiSlice";
import styles from "@/styles/InterviewSession.module.css";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function InterviewSession() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { questionIds, currentIndex, answers, elapsedSeconds, isActive, isCompleted, config } =
    useAppSelector((s) => s.interview);
  const { user } = useAppSelector((s) => s.auth);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestionId = questionIds[currentIndex];
  const { data: question } = useGetQuestionByIdQuery(currentQuestionId, {
    skip: !currentQuestionId,
  });

  const { data: favorites = [] } = useGetFavoritesQuery(user?.id ?? "", {
    skip: !user,
  });
  const [toggleFavorite] = useToggleFavoriteMutation();

  useEffect(() => {
    if (!config || questionIds.length === 0) {
      router.replace("/");
    }
  }, [config, questionIds, router]);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => dispatch(tickTimer()), 1000);
    return () => clearInterval(interval);
  }, [isActive, dispatch]);

  useEffect(() => {
    if (isCompleted) {
      router.push("/interview/result");
    }
  }, [isCompleted, router]);

  useEffect(() => {
    setSelectedIndex(null);
    setShowResult(false);
    setQuestionStartTime(Date.now());
  }, [currentIndex]);

  const handleSelect = (index: number) => {
    if (showResult || !question) return;
    setSelectedIndex(index);
    setShowResult(true);

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    dispatch(
      answerQuestion({
        questionId: question.id,
        selectedIndex: index,
        isCorrect: index === question.correctIndex,
        category: question.category,
        timeSpentSeconds: timeSpent,
      })
    );
  };

  const handleNext = () => {
    if (currentIndex < questionIds.length - 1) {
      dispatch(nextQuestion());
    } else {
      dispatch(finishInterview());
    }
  };

  const handleToggleFavorite = useCallback(async () => {
    if (!user || !question) return;
    await toggleFavorite({ userId: user.id, questionId: question.id });
  }, [user, question, toggleFavorite]);

  if (!question) {
    return <div className={styles.empty}>Загрузка вопроса...</div>;
  }

  const progress = ((currentIndex + 1) / questionIds.length) * 100;
  const isFavorite = favorites.includes(question.id);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <span className={styles.progress}>
          Вопрос {currentIndex + 1} из {questionIds.length}
        </span>
        <div className={styles.timer}>
          <span className={styles.timerIcon}>⏱</span>
          {formatTime(elapsedSeconds)}
        </div>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.questionCard}>
        <span className={styles.category}>{question.category}</span>
        <h2 className={styles.questionText}>{question.text}</h2>

        <div className={styles.options}>
          {question.options.map((option, index) => {
            let optionClass = styles.option;
            if (selectedIndex === index) optionClass += ` ${styles.optionSelected}`;
            if (showResult && index === question.correctIndex)
              optionClass += ` ${styles.optionCorrect}`;
            if (showResult && selectedIndex === index && index !== question.correctIndex)
              optionClass += ` ${styles.optionWrong}`;

            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => handleSelect(index)}
                disabled={showResult}
              >
                <span className={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={styles.explanation}>{question.explanation}</div>
        )}

        <div className={styles.actions}>
          {user && (
            <button
              className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteActive : ""}`}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? "★ В избранном" : "☆ В избранное"}
            </button>
          )}
          <button
            className={styles.nextBtn}
            onClick={handleNext}
            disabled={!showResult}
          >
            {currentIndex < questionIds.length - 1 ? "Далее" : "Завершить"}
          </button>
        </div>
      </div>
    </div>
  );
}
