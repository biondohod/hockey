import axios from "axios";

const URL_BASE = "https://proj.raitonobe.ru/api/";

export const createUserAccount = async (user: INewUser) => {
  const response = await axios.post(`${URL_BASE}register`, user);
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${URL_BASE}login`, { email, password });
  return response.data;
}

export const getUser = async (id: string | number | null, token: string | null) => {
  if (!id || !token) return null;
  const response = await axios.get(`${URL_BASE}users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}