import { Stack, Slot, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ReactNode, useEffect, useState } from 'react';
import ToastWrapper from '@/components/ToastWrapper';

function AuthCheck({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Проверяем, что компоненты полностью смонтированы
  useEffect(() => {
    setIsMounted(true); 
  }, []);

  // Навигация происходит только после монтирования и проверки авторизации
  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.replace('/login'); // Перенаправление на страницу логина после монтирования
    }
  }, [isAuthenticated, router, isMounted]);

  // Показываем загрузочный экран или null, пока проверяется авторизация
  if (!isMounted || !isAuthenticated) {
    return null; // Здесь можно показать какой-нибудь спиннер, если нужно
  }

  return <>{children}</>; // Рендерим дочерние элементы
}

export default function Layout() {
  return (
    <AuthProvider>
      <ToastWrapper>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="index" options={{}} />
        </Stack>
        <AuthCheck>
          <Slot /> {/* Добавляем Slot для рендеринга страниц */}
        </AuthCheck>
      </ToastWrapper>
    </AuthProvider>
  );
}
