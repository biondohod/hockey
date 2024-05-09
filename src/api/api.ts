import axios, { AxiosResponse } from "axios";

const URL_BASE = "https://proj.raitonobe.ru/api/";

export const createUserAccount = async (user: INewUser) => {
  const response = await axios.post(`${URL_BASE}register`, user);
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${URL_BASE}login`, { email, password });
  return response.data;
}
