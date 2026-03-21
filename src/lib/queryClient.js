import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Client Configuration
 * Handles server state management, caching, and data fetching
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      cacheTime: 1000 * 60 * 10, // Cache persists for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1, // Retry failed requests once
      refetchOnMount: true, // Refetch when component mounts
    },
    mutations: {
      retry: 1,
    },
  },
});

export default queryClient;
