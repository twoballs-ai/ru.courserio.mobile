import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import * as Yup from "yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from "@/services/auth.service"; // Adjust the import path if needed

function AllProfilesLogin() {
  const [inputUsernameValue, setInputUsernameValue] = useState('');
  const [inputPasswordValue, setInputPasswordValue] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const validationSchema = Yup.object().shape({
    username: Yup.string().email("Некорректный email, пожалуйста добавьте корректный").required("Обязательно"),
    password: Yup.string().min(8, "Пароль должен содержать минимум 8 символов").required("Обязательно"),
  });

  const validateForm = async () => {
    try {
      await validationSchema.validate({
        username: inputUsernameValue,
        password: inputPasswordValue,
      }, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const submitForm = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    const formData = {
      username: inputUsernameValue,
      password: inputPasswordValue,
    };

    await AuthService.login(formData).then(async (response) => {
      if (response.status === 200 || response.status === 201) {
        await AsyncStorage.clear(); // Clear any existing tokens
        await AsyncStorage.setItem("access_token", JSON.stringify(response?.data?.access_token));
        await AsyncStorage.setItem("refresh_token", JSON.stringify(response?.data?.refresh_token));
        if (response?.data?.type === "teacher_model") {
          await AsyncStorage.setItem("role", JSON.stringify(response?.data?.type));
          // Navigate to teacher profile
        }
        if (response?.data?.type === "student_model") {
          await AsyncStorage.setItem("role", JSON.stringify(response?.data?.type));
          await AsyncStorage.setItem("studentLoginStatus", JSON.stringify("true"));
          // Navigate to student profile
        }
      }
    }).catch((error) => {
      setErrorMsg(error.response?.data?.message || "Ошибка входа");
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, errors.username && styles.errorInput]}
        placeholder="Введите ваш email"
        value={inputUsernameValue}
        onChangeText={setInputUsernameValue}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
      <TextInput
        style={[styles.input, errors.password && styles.errorInput]}
        placeholder="Введите пароль"
        secureTextEntry
        value={inputPasswordValue}
        onChangeText={setInputPasswordValue}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <Button title="Войти" onPress={submitForm} color="#FFA500" />
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default AllProfilesLogin;
