import axios from "axios";
import TokenService from "./token.service";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import AuthService from "./auth.service";

const instance = axios.create({
  // baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    const token = await TokenService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    // Check if response.data.message exists and show success toast
    if (res.data && res.data.message) {
      Toast.show({
        type: 'success',
        text1: res.data.message,
      });
    }
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      console.log(err.response);
      // Show error toast if response contains an error message
      if (Array.isArray(err.response.data.detail)) {
        Toast.show({
          type: 'error',
          text1: `Ошибка с кодом: ${err.response.status}`,
        });
      } else if (typeof err.response.data.detail === 'string') {
        Toast.show({
          type: 'error',
          text1: err.response.data.detail,
        });
      }

      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await AuthService.refreshToken();
          const accessToken = rs.access_token;
          await TokenService.updateLocalAccessToken(accessToken);
          instance.defaults.headers.common["Authorization"] = 'Bearer ' + accessToken;
          return instance(originalConfig);
        } catch (_error) {
          console.log("Error refreshing token");
          // Show error toast for token refresh failure
          Toast.show({
            type: 'error',
            text1: "Failed to refresh token. Please log in again.",
          });
          // AuthService.logout();
          return Promise.reject(_error);
        }
      }

      if (err.response.status === 403) {
        Toast.show({
          type: 'error',
          text1: "You do not have permission to perform this action.",
        });
        return Promise.reject(err.response.data);
      }
    } else {
      // Show a generic error toast if no response is received from the server
      Toast.show({
        type: 'error',
        text1: "Произошла странная ошибка",
      });
    }

    return Promise.reject(err);
  }
);

export default instance;
