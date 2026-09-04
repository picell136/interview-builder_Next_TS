import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { INTERVIEW_QUESTION_COUNT } from "@/data/questions";
import type {
  InterviewAnswer,
  InterviewConfig,
  Level,
  Role,
  Technology,
} from "@/types";

interface InterviewState {
  config: InterviewConfig | null;
  questionIds: string[];
  currentIndex: number;
  answers: InterviewAnswer[];
  startedAt: number | null;
  elapsedSeconds: number;
  isActive: boolean;
  isCompleted: boolean;
}

const initialState: InterviewState = {
  config: null,
  questionIds: [],
  currentIndex: 0,
  answers: [],
  startedAt: null,
  elapsedSeconds: 0,
  isActive: false,
  isCompleted: false,
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    startInterview(
      state,
      action: PayloadAction<{ config: InterviewConfig; questionIds: string[] }>
    ) {
      state.config = action.payload.config;
      state.questionIds = action.payload.questionIds;
      state.currentIndex = 0;
      state.answers = [];
      state.startedAt = Date.now();
      state.elapsedSeconds = 0;
      state.isActive = true;
      state.isCompleted = false;
    },
    answerQuestion(state, action: PayloadAction<InterviewAnswer>) {
      state.answers.push(action.payload);
    },
    nextQuestion(state) {
      if (state.currentIndex < state.questionIds.length - 1) {
        state.currentIndex += 1;
      } else {
        state.isActive = false;
        state.isCompleted = true;
      }
    },
    tickTimer(state) {
      if (state.isActive && state.startedAt) {
        state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
      }
    },
    finishInterview(state) {
      state.isActive = false;
      state.isCompleted = true;
    },
    resetInterview() {
      return initialState;
    },
    setBuilderRole(state, action: PayloadAction<Role | null>) {
      if (!state.config) {
        state.config = {
          role: action.payload ?? "frontend",
          level: "junior",
          technologies: [],
          categories: [],
          questionCount: INTERVIEW_QUESTION_COUNT,
        };
      } else if (action.payload) {
        state.config.role = action.payload;
        state.config.technologies = [];
      }
    },
    setBuilderLevel(state, action: PayloadAction<Level>) {
      if (state.config) state.config.level = action.payload;
    },
    toggleBuilderTechnology(state, action: PayloadAction<Technology>) {
      if (!state.config) return;
      const tech = action.payload;
      const idx = state.config.technologies.indexOf(tech);
      if (idx >= 0) {
        state.config.technologies.splice(idx, 1);
      } else {
        state.config.technologies.push(tech);
      }
    },
    toggleBuilderCategory(state, action: PayloadAction<string>) {
      if (!state.config) return;
      const cat = action.payload;
      const idx = state.config.categories.indexOf(cat);
      if (idx >= 0) {
        state.config.categories.splice(idx, 1);
      } else {
        state.config.categories.push(cat);
      }
    },
    initBuilder(state) {
      state.config = {
        role: "frontend",
        level: "junior",
        technologies: [],
        categories: [],
        questionCount: INTERVIEW_QUESTION_COUNT,
      };
    },
  },
});

export const {
  startInterview,
  answerQuestion,
  nextQuestion,
  tickTimer,
  finishInterview,
  resetInterview,
  setBuilderRole,
  setBuilderLevel,
  toggleBuilderTechnology,
  toggleBuilderCategory,
  initBuilder,
} = interviewSlice.actions;

export default interviewSlice.reducer;
