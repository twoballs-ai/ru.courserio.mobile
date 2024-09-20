import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { apiUrl, apiUserUrl } from "@/constants/shared";
import TokenService from "./token.service";

const teacherRegister = async (data) => {
  console.log(data);
  try {
    return await axios.post(apiUserUrl + "teacher-register/", data);
  } catch (error) {
    console.error("Error during teacher registration:", error);
    throw error;
  }
};

const studentRegister = async (data) => {
  try {
    return await axios.post(apiUserUrl + "student-register/", data);
  } catch (error) {
    console.error("Error during student registration:", error);
    throw error;
  }
};

const login = async (formData) => {
  try {
    const response = await axios.post(apiUrl + "v1/user/token", formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

const refreshToken = async () => {
  try {
    const refresh_token = await TokenService.getLocalRefreshToken();
    const formData = new URLSearchParams();
    formData.append('refresh_token', refresh_token);

    const response = await axios.post(apiUrl + "v1/user/token/refresh/", formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: "Error refreshing token!",
    });
    console.error("Error refreshing token:", error);
    throw error;
  }
};

const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error retrieving current user:", error);
    return null;
  }
};

const AuthService = {
  teacherRegister,
  studentRegister,
  login,
  getCurrentUser,
  refreshToken,
};

export default AuthService;
