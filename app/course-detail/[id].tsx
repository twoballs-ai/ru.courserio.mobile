import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { serverUrl } from '@/constants/shared';
import SiteService from '@/services/siteNoAuth.service';
import LmsButton from '@/components/reUseComponents/Button';
import StudentService from '@/services/student.service';

interface CourseData {
    title: string;
    description: string;
    cover_path: string;
    teacher: {
        id: number;
        name: string;
        lastname: string;
    } | null;
    course_subscription: number;
}

function CourseDetail() {
    const router = useRouter();
    const { id: course_id } = useLocalSearchParams(); // Get course ID from route parameters

    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [userLoggedStatus, setUserLoggedStatus] = useState("");
    const [enrollStatus, setEnrollStatus] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await SiteService.getCourse(course_id);
                if (response.status === 200) {
                    setCourseData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch course data:", error);
            }
        };

        fetchData();

        const checkLoginStatus = async () => {
            const storedLoginStatus = await AsyncStorage.getItem("studentLoginStatus");
            if (storedLoginStatus === "true") {
                setUserLoggedStatus("success");
                fetchEnrollmentStatus();
            }
        };

        checkLoginStatus();
    }, [course_id]);

    const fetchEnrollmentStatus = async () => {
        try {
            const response = await StudentService.checkEnrollment(course_id);
            if (response.status === 200) {
                setEnrollStatus(response.data.enrolled_status);
            }
        } catch (error) {
            console.error("Failed to fetch enrollment status:", error);
        }
    };

    const enrollCourse = async () => {
        try {
            const response = await StudentService.enrollToCourse(course_id);
            if (response.status === 200) {
                setEnrollStatus(response.data.enrolled_status);
            }
        } catch (error) {
            console.error("Failed to enroll in course:", error);
        }
    };

    const unsubscribeFromCourse = async () => {
        try {
            const response = await StudentService.unenrollStudentLight(course_id);
            if (response.status === 200) {
                setEnrollStatus("not enrolled");
            }
        } catch (error) {
            console.error("Failed to unsubscribe from course:", error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.courseInfo}>
                <Image
                    source={{ uri: `${serverUrl}/${courseData?.cover_path}` }}
                    style={styles.image}
                />
                <View style={styles.infoWrap}>
                    <Text style={styles.title}>{courseData?.title}</Text>
                    <Text style={styles.description}>{courseData?.description}</Text>
                    <Text>
                        Автор курса:{" "}
                        <Text
                            onPress={() => {
                                if (courseData?.teacher) {
                                    router.push(`/teacher-detail/${courseData.teacher.id}`);
                                }
                            }}
                            style={styles.link}
                        >
                            {courseData?.teacher ? `${courseData.teacher.name} ${courseData.teacher.lastname}` : 'Loading...'}
                        </Text>
                    </Text>
                    <Text>Всего подписавшихся пользователей: {courseData?.course_subscription}</Text>
                    <View style={styles.enrollButtons}>
                        {userLoggedStatus === "success" && (
                            enrollStatus === "enrolled" ? (
                                <>
                                    <LmsButton
                                        buttonText="Проходить курс"
                                        handleClick={() => router.push(`/course-learning/${course_id}/learning`)}
                                    />
                                    <Text>Вы подписаны на курс и можете проходить его</Text>
                                    <LmsButton
                                        buttonText="Отписаться от курса"
                                        handleClick={unsubscribeFromCourse}
                                    />
                                    <Text>Вы не потеряете ваш прогресс, просто перестанете получать оповещения по курсу</Text>
                                </>
                            ) : (
                                <LmsButton
                                    buttonText="Подписаться на курс"
                                    handleClick={enrollCourse}
                                />
                            )
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    courseInfo: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 8,
    },
    infoWrap: {
        marginLeft: 16,
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        marginVertical: 8,
    },
    link: {
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
    enrollButtons: {
        marginTop: 16,
    },
});

export default CourseDetail;
