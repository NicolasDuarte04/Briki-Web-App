import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";

export function useAuth() {
  const { 
    data: user, 
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const refetchUser = async () => {
    return await refetch();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refetchUser
  };
}