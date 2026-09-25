import type { CurriculumLevel, CurriculumSubject, CurriculumUnit } from '../types/content';

/**
 * Normalizes Arabic text for flexible and user-friendly searching:
 * - Removes diacritics / tashkeel
 * - Removes tatweel (kashida)
 * - Normalizes Alef forms (أ, إ, آ, ٱ -> ا)
 * - Normalizes Taa Marbuta (ة -> ه)
 * - Normalizes Alef Maqsura (ى -> ي)
 * - Lowercases Latin characters & trims whitespace
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Remove diacritics / tashkeel (fathah, dammah, kasrah, sukun, shaddah, tanween, etc.)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Remove tatweel (kashida)
    .replace(/\u0640/g, '')
    // Normalize Alef variants
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Taa Marbuta to Haa
    .replace(/ة/g, 'ه')
    // Normalize Alef Maqsura to Yaa
    .replace(/ى/g, 'ي')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks whether a curriculum unit matches the given search query string.
 * All whitespace-delimited tokens in the query must match somewhere in the unit's searchable text.
 */
export function unitMatchesQuery(
  unit: CurriculumUnit,
  query: string,
  contextKeywords: string[] = [],
): boolean {
  const normalizedQuery = normalizeArabic(query);
  if (!normalizedQuery) return true;

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  const searchableStrings = [
    unit.title,
    unit.description ?? '',
    ...unit.lessons.map((lesson) => lesson.title),
    ...contextKeywords,
  ];

  const haystack = normalizeArabic(searchableStrings.join(' '));

  return tokens.every((token) => haystack.includes(token));
}

export interface CurriculumSearchResult {
  filteredLevels: CurriculumLevel[];
  matchedUnitsCount: number;
  totalUnitsCount: number;
  isSearching: boolean;
}

/**
 * Filters the curriculum levels by search query, preserving the hierarchy
 * of levels and subjects while retaining only matching units.
 */
export function filterCurriculum(
  levels: CurriculumLevel[],
  query: string,
): CurriculumSearchResult {
  const trimmed = query.trim();
  const isSearching = trimmed.length > 0;

  let totalUnitsCount = 0;
  let matchedUnitsCount = 0;

  const filteredLevels: CurriculumLevel[] = [];

  for (const level of levels) {
    const levelMatchingSubjects: CurriculumSubject[] = [];

    for (const subject of level.subjects) {
      totalUnitsCount += subject.units.length;

      const matchingUnits = isSearching
        ? subject.units.filter((unit) =>
            unitMatchesQuery(unit, trimmed, [
              level.title,
              level.stage ?? '',
              subject.title,
            ]),
          )
        : subject.units;

      if (!isSearching) {
        matchedUnitsCount += subject.units.length;
        levelMatchingSubjects.push(subject);
      } else if (matchingUnits.length > 0) {
        matchedUnitsCount += matchingUnits.length;
        levelMatchingSubjects.push({
          ...subject,
          units: matchingUnits,
        });
      }
    }

    if (levelMatchingSubjects.length > 0) {
      filteredLevels.push({
        ...level,
        subjects: levelMatchingSubjects,
      });
    }
  }

  return {
    filteredLevels,
    matchedUnitsCount,
    totalUnitsCount,
    isSearching,
  };
}
