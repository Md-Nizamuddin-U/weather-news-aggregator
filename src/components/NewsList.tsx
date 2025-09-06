import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, Image, StyleSheet } from 'react-native';
import { NewsArticle } from '../types';

export function NewsList({ articles }: { articles: NewsArticle[] }) {
  return (
    <FlatList
      data={articles}
      scrollEnabled={false}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.url)}>
          {item.urlToImage ? <Image source={{ uri: item.urlToImage }} style={styles.image} /> : null}
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
            <Text style={styles.source}>{item.source?.name} • {item.publishedAt ? item.publishedAt.split('T')[0] : ''}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { 
    flexDirection: 'row', 
    padding: 10, 
    marginVertical: 6, 
    backgroundColor: '#2C2C34', // soft dark-gray card, aesthetic
    borderRadius: 8,
    shadowColor:'#000',
    shadowOpacity:0.2,
    shadowRadius:4,
    shadowOffset:{ width:0, height:2 },
  },
  image: { 
    width: 90, 
    height: 70, 
    borderRadius: 6,
    backgroundColor:'#1E1E1E' // fallback if image fails
  },
  content: { 
    flex: 1, 
    marginLeft: 8 
  },
  title: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#FFFFFF' // white title for contrast
  },
  desc: { 
    fontSize: 12, 
    color: '#CCCCCC', // light gray description
    marginTop: 4 
  },
  source: { 
    marginTop: 6, 
    fontSize: 11, 
    color: '#A0A0A0' // subtle gray for source
  }
});

