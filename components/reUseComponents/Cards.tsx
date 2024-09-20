import React from 'react';
import { Card, Text } from '@ant-design/react-native';
import { Image, View, StyleSheet } from 'react-native';

const { CardBody } = Card;

interface CustomCardProps {
  title: string;
  description: string;
  image: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ title, description, image }) => (
  <Card full>
    <Card.Body>
      <View style={styles.cardContent}>
        <Image source={{ uri: image }} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </View>
    </Card.Body>
  </Card>
);

const styles = StyleSheet.create({
  cardContent: {
    padding: 16,
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardTextContainer: {
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default CustomCard;
