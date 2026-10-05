import type { SQLiteDatabase } from 'expo-sqlite';
import { SQLiteCourseRepository } from '@/data/repositories/SQLiteCourseRepository';
import { SQLiteDictionaryRepository } from '@/data/repositories/SQLiteDictionaryRepository';
import { SQLiteExamRepository } from '@/data/repositories/SQLiteExamRepository';
import { SQLiteJournalRepository } from '@/data/repositories/SQLiteJournalRepository';
import { SQLiteProgressRepository } from '@/data/repositories/SQLiteProgressRepository';
import { SQLiteSettingsRepository } from '@/data/repositories/SQLiteSettingsRepository';
import { ExpoNotificationService } from '@/data/services/ExpoNotificationService';
import { ExpoSpeechService } from '@/data/services/ExpoSpeechService';
import { LocalSpellChecker } from '@/data/services/LocalSpellChecker';
import {
  AddCustomWordUseCase,
  BrowseDictionaryUseCase,
  DeleteJournalEntryUseCase,
  GetCourseCatalogUseCase,
  GetDailyPromptUseCase,
  GetDashboardUseCase,
  GetExamEligibilityUseCase,
  GetJournalEntryUseCase,
  GetJournalHistoryUseCase,
  GetLessonUseCase,
  GetProgressOverviewUseCase,
  GetSettingsUseCase,
  LookupWordUseCase,
  RecordStudyTimeUseCase,
  SaveJournalEntryUseCase,
  SearchDictionaryUseCase,
  SpeakTextUseCase,
  StartExamUseCase,
  SubmitExamUseCase,
  SubmitLessonQuizUseCase,
  UpdateSettingsUseCase,
} from '@/domain/usecases';

/**
 * Composition root: the only place where concrete Data implementations are bound to Domain
 * contracts. Presentation code depends on use cases, never on SQLite or Expo modules directly.
 */
export function createContainer(db: SQLiteDatabase) {
  const courses = new SQLiteCourseRepository(db);
  const dictionary = new SQLiteDictionaryRepository(db);
  const exams = new SQLiteExamRepository(db);
  const journal = new SQLiteJournalRepository(db);
  const progress = new SQLiteProgressRepository(db);
  const settings = new SQLiteSettingsRepository(db);

  const speech = new ExpoSpeechService();
  const notifications = new ExpoNotificationService();
  const spellChecker = new LocalSpellChecker();

  const examEligibility = new GetExamEligibilityUseCase(exams, courses);

  return {
    services: { spellChecker },
    repositories: { dictionary },
    useCases: {
      recordStudyTime: new RecordStudyTimeUseCase(progress),
      getDashboard: new GetDashboardUseCase(progress, courses, examEligibility),
      getProgressOverview: new GetProgressOverviewUseCase(progress),
      getCourseCatalog: new GetCourseCatalogUseCase(courses, progress),
      getLesson: new GetLessonUseCase(courses, progress),
      submitLessonQuiz: new SubmitLessonQuizUseCase(progress),
      getExamEligibility: examEligibility,
      startExam: new StartExamUseCase(exams, progress, examEligibility),
      submitExam: new SubmitExamUseCase(exams, progress),
      getDailyPrompt: new GetDailyPromptUseCase(journal, courses, progress),
      saveJournalEntry: new SaveJournalEntryUseCase(journal),
      getJournalHistory: new GetJournalHistoryUseCase(journal),
      getJournalEntry: new GetJournalEntryUseCase(journal),
      deleteJournalEntry: new DeleteJournalEntryUseCase(journal),
      searchDictionary: new SearchDictionaryUseCase(dictionary),
      lookupWord: new LookupWordUseCase(dictionary),
      browseDictionary: new BrowseDictionaryUseCase(dictionary),
      getSettings: new GetSettingsUseCase(settings),
      updateSettings: new UpdateSettingsUseCase(settings, notifications),
      addCustomWord: new AddCustomWordUseCase(settings),
      speakText: new SpeakTextUseCase(settings, speech),
    },
  };
}

export type Container = ReturnType<typeof createContainer>;
