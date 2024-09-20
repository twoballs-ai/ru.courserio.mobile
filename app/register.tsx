import { useState } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = () => {
    // Логика для регистрации
  };

  return (
    <View>
      <Text>Регистрация</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Зарегистрироваться" onPress={handleRegister} />
      <Button title="Войти" onPress={() => router.push('/login')} />
    </View>
  );
}
