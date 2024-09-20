import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import SiteService from "@/services/siteNoAuth.service"; // Обнови путь на реальный
import NewAddedCourse from "@/components/HomeComponents/NewAddedCourse"; // Обнови путь на реальный
import LatestNews from "@/components/HomeComponents/LatestNews"; // Обнови путь на реальный
import { StatusBar } from "expo-status-bar";

// Интерфейс курса
interface Course {
  id: number;
  title: string;
  description: string;
  cover_path: string;
}

export default function Home() {
  const [lastAddedCourses, setLastAddedCourses] = useState<Course[]>([]);
  const items = "8";

  // Получаем последние добавленные курсы
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SiteService.homePageLastAddedCourses({ items });
        if (response.status === 200 || response.status === 201) {
          setLastAddedCourses(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchData();
  }, []);

  // Функция рендеринга для FlatList
  const renderItem = () => (
    <View>
      <Text style={styles.title}>Недавно добавленные курсы</Text>
      <NewAddedCourse lastAddedCourses={lastAddedCourses} />
      <Text style={styles.title}>Последние новости</Text>
      <LatestNews />
    </View>
  );

  return (
    <FlatList
      data={[{}]} // Используем пустой массив для рендеринга одного элемента
      renderItem={renderItem}
      keyExtractor={() => "home"} // Уникальный ключ
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
