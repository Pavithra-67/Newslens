import { NewsCategory } from '../types';

export const APP_CATEGORIES: NewsCategory[] = [
  'India',
  'World',
  'Science & Technology',
  'Space',
  'Business',
  'Environment',
  'Sports',
  'Education'
];

/**
 * Normalizes any category string or slug into the canonical category name.
 * Handles variations like 'business-economy', 'business & economy', 'environment', 'climate', 'space', etc.
 */
export function normalizeCategory(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const clean = raw.trim().toLowerCase().replace(/[-_&]/g, ' ');

  if (clean.includes('india')) return 'India';
  if (clean.includes('world') || clean.includes('global')) return 'World';
  if (clean.includes('space') || clean.includes('isro') || clean.includes('nasa') || clean.includes('astronomy') || clean.includes('orbit') || clean.includes('satellite')) return 'Space';
  if (clean.includes('science') || clean.includes('tech')) return 'Science & Technology';
  if (clean.includes('business') || clean.includes('econom') || clean.includes('finance')) return 'Business';
  if (clean.includes('environment') || clean.includes('climate') || clean.includes('earth')) return 'Environment';
  if (clean.includes('sport')) return 'Sports';
  if (clean.includes('education') || clean.includes('school') || clean.includes('college')) return 'Education';

  return null;
}

/**
 * Converts a canonical category name into a URL-friendly slug.
 */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/ & /g, '-')
    .replace(/\s+/g, '-');
}

/**
 * Checks if an item's category matches a given category filter.
 * Handles 'All', 'Business' vs 'Business & Economy', 'Environment' vs 'Environment & Climate', etc.
 */
export function matchesCategory(itemCategory: string | null | undefined, selectedCategory: string): boolean {
  if (!selectedCategory || selectedCategory === 'All') return true;
  if (!itemCategory) return false;

  const normalizedSelected = normalizeCategory(selectedCategory);
  const normalizedItem = normalizeCategory(itemCategory);

  if (normalizedSelected && normalizedItem) {
    return normalizedSelected === normalizedItem;
  }

  return itemCategory.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
}
