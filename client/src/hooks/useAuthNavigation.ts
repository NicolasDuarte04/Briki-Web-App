import { useAuth } from "./use-auth";
import { InsuranceCategory } from "../../../shared/schema";
import { CATEGORY_PATHS } from "../constants/sharedContent";

/**
 * Custom hook for auth-aware navigation throughout the app
 * Returns paths based on authentication status and handles redirects intelligently
 */
export function useAuthNavigation() {
  const { isAuthenticated } = useAuth();

  /**
   * Get the appropriate path for a category based on auth status
   * @param category The insurance category
   * @returns The correct path for the user's auth state
   */
  const getCategoryPath = (category: InsuranceCategory): string => {
    if (isAuthenticated) {
      return CATEGORY_PATHS[category].app;
    } else {
      return CATEGORY_PATHS[category].explore;
    }
  };

  /**
   * Get the quote path for a category
   * @param category The insurance category
   * @returns The path to the quote page for the category
   */
  const getQuotePath = (category: InsuranceCategory): string => {
    return `/insurance/${category}/quote`;
  };

  /**
   * Get the landing path based on auth status
   * @returns The appropriate home path
   */
  const getHomePath = (): string => {
    return isAuthenticated ? "/categories" : "/";
  };

  /**
   * Determine if a path is active based on current path
   * @param path The path to check
   * @param currentPath The current path from useLocation
   * @returns True if the path is active
   */
  const isActivePath = (path: string, currentPath: string): boolean => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return {
    getCategoryPath,
    getQuotePath,
    getHomePath,
    isActivePath,
    isAuthenticated
  };
}