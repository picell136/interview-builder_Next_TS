import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { filterQuestions, QUESTIONS } from "@/data/questions";
import { storage } from "@/lib/storage";
import type {
  AuthCredentials,
  CategoryStat,
  InterviewAttempt,
  InterviewConfig,
  Question,
  RegisterData,
  User,
} from "@/types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Attempts", "Favorites", "Stats"],
  endpoints: (builder) => ({
    login: builder.mutation<User, AuthCredentials>({
      async queryFn(credentials) {
        await delay();
        const users = storage.getUsers();
        const found = users.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );
        if (!found) {
          return { error: { status: 401, data: "Неверный email или пароль" } };
        }
        storage.setSession(found.id);
        return {
          data: { id: found.id, email: found.email, name: found.name },
        };
      },
    }),

    register: builder.mutation<User, RegisterData>({
      async queryFn(data) {
        await delay();
        const users = storage.getUsers();
        if (users.some((u) => u.email === data.email)) {
          return { error: { status: 409, data: "Пользователь уже существует" } };
        }
        const newUser = {
          id: crypto.randomUUID(),
          email: data.email,
          name: data.name,
          password: data.password,
        };
        storage.saveUsers([...users, newUser]);
        storage.setSession(newUser.id);
        return {
          data: { id: newUser.id, email: newUser.email, name: newUser.name },
        };
      },
    }),

    getQuestions: builder.query<Question[], InterviewConfig>({
      async queryFn(config) {
        await delay(100);
        const filtered = filterQuestions(
          config.role,
          config.level,
          config.technologies,
          config.categories
        );
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        return { data: shuffled };
      },
    }),

    getQuestionById: builder.query<Question | undefined, string>({
      async queryFn(id) {
        const question = QUESTIONS.find((q) => q.id === id);
        return { data: question };
      },
    }),

    saveAttempt: builder.mutation<InterviewAttempt, Omit<InterviewAttempt, "id">>({
      async queryFn(attempt) {
        await delay();
        const attempts = storage.getAttempts();
        const newAttempt: InterviewAttempt = {
          ...attempt,
          id: crypto.randomUUID(),
        };
        storage.saveAttempts([newAttempt, ...attempts]);
        return { data: newAttempt };
      },
      invalidatesTags: ["Attempts", "Stats"],
    }),

    getAttempts: builder.query<InterviewAttempt[], string>({
      async queryFn(userId) {
        await delay(100);
        const attempts = storage.getAttempts().filter((a) => a.userId === userId);
        return { data: attempts };
      },
      providesTags: ["Attempts"],
    }),

    getFavorites: builder.query<string[], string>({
      async queryFn(userId) {
        await delay(100);
        const favorites = storage.getFavorites();
        return { data: favorites[userId] ?? [] };
      },
      providesTags: ["Favorites"],
    }),

    toggleFavorite: builder.mutation<{ questionId: string; isFavorite: boolean }, { userId: string; questionId: string }>({
      async queryFn({ userId, questionId }) {
        await delay(100);
        const favorites = storage.getFavorites();
        const userFavs = favorites[userId] ?? [];
        const isFavorite = userFavs.includes(questionId);
        const updated = isFavorite
          ? userFavs.filter((id) => id !== questionId)
          : [...userFavs, questionId];
        storage.saveFavorites({ ...favorites, [userId]: updated });
        return { data: { questionId, isFavorite: !isFavorite } };
      },
      invalidatesTags: ["Favorites"],
    }),

    getWeakTopics: builder.query<CategoryStat[], string>({
      async queryFn(userId) {
        await delay(100);
        const attempts = storage.getAttempts().filter((a) => a.userId === userId);
        const categoryMap = new Map<string, { total: number; correct: number }>();

        for (const attempt of attempts) {
          for (const answer of attempt.answers) {
            const existing = categoryMap.get(answer.category) ?? { total: 0, correct: 0 };
            existing.total += 1;
            if (answer.isCorrect) existing.correct += 1;
            categoryMap.set(answer.category, existing);
          }
        }

        const stats: CategoryStat[] = Array.from(categoryMap.entries())
          .map(([category, { total, correct }]) => ({
            category,
            total,
            correct,
            percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
          }))
          .sort((a, b) => a.percentage - b.percentage);

        return { data: stats };
      },
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useSaveAttemptMutation,
  useGetAttemptsQuery,
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
  useGetWeakTopicsQuery,
} = apiSlice;
