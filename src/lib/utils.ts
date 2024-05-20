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

export function formatDate(dateString: string): string {
  const options: { year: "numeric", month: "long", day: "numeric" } = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', options);
}

export function calculateAge(birthDateString: string): string {
  const birthDate = new Date(birthDateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  let ageString = '';
  if (age % 10 === 1 && age % 100 !== 11) {
    ageString = `${age} год`;
  } else if (age % 10 >= 2 && age % 10 <= 4 && (age % 100 < 10 || age % 100 >= 20)) {
    ageString = `${age} года`;
  } else {
    ageString = `${age} лет`;
  }

  return ageString;
}