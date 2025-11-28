import { SearchResult, TypeBadgeProps } from "../types/SearchResult";

/**
 * Get badge properties based on the result type
 * Maps result types (client, application, document) to their badge visual styles
 */
export const getTypeBadgeProps = (type: SearchResult['type']): TypeBadgeProps => {
  const badgeMap: Record<SearchResult['type'], TypeBadgeProps> = {
    client: { type: 'information', content: 'Client' },
    application: { type: 'success', content: 'Application' },
    document: { type: 'midtone', content: 'Document' }
  };
  return badgeMap[type];
};

/**
 * Get badge properties based on priority level
 * Maps priority levels (high, medium, low) to their badge visual styles
 */
export const getPriorityBadgeProps = (priority: 'high' | 'medium' | 'low'): TypeBadgeProps => {
  const badgeMap: Record<'high' | 'medium' | 'low', TypeBadgeProps> = {
    high: { type: 'emergency', content: 'High' },
    medium: { type: 'important', content: 'Medium' },
    low: { type: 'archived', content: 'Low' }
  };
  return badgeMap[priority];
};
