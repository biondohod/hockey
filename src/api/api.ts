import axios from "axios";

const URL_BASE = "https://proj.raitonobe.ru/api/";

const createUserAccount = async (user: INewUser) => {
  const response = await axios.post(`${URL_BASE}register`, user);
  return response.data;
}