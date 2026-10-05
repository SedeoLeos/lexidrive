import type { Exam, ExamAnswer, ExamResult } from '../entities';
import { matchesAnswer } from './quizGrading';

/**
 * Grades a full level exam. Unanswered questions earn 0.
 * The exam is passed when earned / max ≥ exam.passRatio.
 */
export function gradeExam(exam: Exam, answers: Readonly<Record<string, ExamAnswer>>): ExamResult {
  let score = 0;
  let maxScore = 0;

  const details = exam.questions.map((q) => {
    maxScore += q.points;
    const answer = answers[q.id];
    let correct = false;
    let expected: string;

    if (q.kind === 'mcq') {
      expected = q.options[q.answerIndex];
      correct = answer?.kind === 'mcq' && answer.index === q.answerIndex;
    } else {
      expected = q.answers[0];
      correct = answer?.kind === 'fill' && matchesAnswer(answer.text, q.answers);
    }

    const earned = correct ? q.points : 0;
    score += earned;
    return { questionId: q.id, correct, earned, expected };
  });

  const ratio = maxScore === 0 ? 0 : score / maxScore;
  return {
    examId: exam.id,
    score,
    maxScore,
    ratio,
    // Small epsilon so 16/20 with passRatio 0.8 is not rejected by floating-point noise.
    passed: ratio + 1e-9 >= exam.passRatio,
    details,
  };
}
