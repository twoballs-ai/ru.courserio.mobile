import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SiteService from '../../services/siteNoAuth.service';
import HTMLView from 'react-native-htmlview';

interface Blog {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  created_at: string;
  updated_at?: string;
}

const LatestNews: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const items = 3;
      const response = await SiteService.getNewsBlog(items);
      if (response.status === 200 || response.status === 201) {
        setBlogs(response.data.data);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const renderItem = ({ item }: { item: Blog }) => (
    <View style={styles.blogCard}>
      <Text style={styles.newsCategory}>{item.category}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.content}>
        <HTMLView
          value={item.content}
          stylesheet={styles.html}
          onLinkPress={(url) => console.log(`Link pressed: ${url}`)}
        />
        <TouchableOpacity
          style={styles.readMore}
          onPress={() => navigation.navigate('NewsBlog', { id: item.id })}
        >
          <Text style={styles.readMoreText}>Читать далее</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.author}>Автор: {item.author}</Text>
      <Text style={styles.date}>
        {item.updated_at ? `Обновлено: ${formatDate(item.updated_at)}` : `Создано: ${formatDate(item.created_at)}`}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={blogs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  blogCard: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  newsCategory: {
    fontSize: 14,
    color: '#888',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  content: {
    marginBottom: 8,
  },
  readMore: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  readMoreText: {
    color: '#fff',
    textAlign: 'center',
  },
  author: {
    fontSize: 14,
    color: '#555',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  html: {
    // Здесь вы можете настроить стили для HTML-контента
  },
});

export default LatestNews;
