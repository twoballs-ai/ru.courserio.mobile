import AsyncStorage from '@react-native-async-storage/async-storage';

const getLocalRefreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    return refreshToken ? JSON.parse(refreshToken) : null;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

const getLocalAccessToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    return accessToken ? JSON.parse(accessToken) : null;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

const updateLocalRefreshToken = async (token) => {
  try {
    await AsyncStorage.setItem('refresh_token', JSON.stringify(token));
  } catch (error) {
    console.error("Error updating refresh token:", error);
  }
};

const updateLocalAccessToken = async (token) => {
  try {
    await AsyncStorage.setItem('access_token', JSON.stringify(token));
  } catch (error) {
    console.error("Error updating access token:", error);
  }
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalRefreshToken,
  updateLocalAccessToken,
};

export default TokenService;
