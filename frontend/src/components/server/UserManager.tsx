import axios, { AxiosError } from "axios";
import { user_profile } from "../constants/Const";


export const LogOut = () => {};

export const getUserData = async (user_id: string) => {
  try {
    const data = await axios.get(`${user_profile}${user_id}`);
    return [200, data.data];
  } catch (error) {
    const e = error as AxiosError;
    console.error(e.response?.data);
    return [e.response?.status, null];
  }
};
