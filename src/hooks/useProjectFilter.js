import { useMemo } from 'react';

/**
 * Hook to filter projects by search query and category (all, featured, standard).
 * Prevents filtering logic from collapsing into the view component.
 */
export function useProjectFilter(projects, searchQuery, activeFilter) {
  return useMemo(() => {
    if (!Array.isArray(projects)) return [];

    return projects.filter((project) => {
      // Search query filter
      const q = (searchQuery || '').toLowerCase();
      const titleMatch = (project.title || '').toLowerCase().includes(q);
      const domainMatch = (project.domain || '').toLowerCase().includes(q);
      const techMatch = (project.tech || []).some((t) => t.toLowerCase().includes(q));
      const matchesSearch = titleMatch || domainMatch || techMatch;

      // Category filter
      const isFeatured = project.featured || project.isFeatured;
      if (activeFilter === 'featured') return matchesSearch && isFeatured;
      if (activeFilter === 'standard') return matchesSearch && !isFeatured;
      return matchesSearch;
    });
  }, [projects, searchQuery, activeFilter]);
}
