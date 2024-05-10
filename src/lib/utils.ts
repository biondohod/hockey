import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './react-query/queryKeys';

export const UseLogoutUser = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useUserContext();
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/auth/sign-in");

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    });
  };

  return logout;
};