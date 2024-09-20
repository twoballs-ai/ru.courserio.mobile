// components/NewAddedCourse.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router
import CustomCard from '@/components/reUseComponents/Cards'; // Update import path as needed
import { serverUrl } from '@/constants/shared'; // Update import path as needed

// Define the type for course
interface Course {
  id: number;
  title: string;
  description: string;
  cover_path: string;
}

// Define the props interface
interface NewAddedCourseProps {
  lastAddedCourses: Course[];
}

const NewAddedCourse: React.FC<NewAddedCourseProps> = ({ lastAddedCourses }) => {
  const router = useRouter(); // Use useRouter hook from expo-router

  const handleCardClick = (courseId: number) => {
    router.push(`/course-detail/${courseId}`); // Navigate to CourseDetail screen
  };

  return (
    <View style={styles.container}>
      {lastAddedCourses.length !== 0 ? (
        lastAddedCourses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.cardWrapper}
            onPress={() => handleCardClick(course.id)}
          >
            <CustomCard
              title={course.title}
              description={course.description}
              image={`${serverUrl}/${course.cover_path}`} // Adjust the image URL as needed
            />
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noCoursesText}>Ожидайте появления курсов</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  noCoursesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default NewAddedCourse;
