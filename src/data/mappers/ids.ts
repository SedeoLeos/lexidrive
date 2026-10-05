/** Stable, human-readable ids for seeded content. */
export function quizId(lessonId: string, position: number): string {
  return `${lessonId}-q${String(position).padStart(2, '0')}`;
}

export function examQuestionId(examId: string, position: number): string {
  return `${examId}-${String(position).padStart(2, '0')}`;
}
