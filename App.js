import React, { useState, useEffect } from 'react';
import { Text, View, Image, TextInput, Button, FlatList, StyleSheet,ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
    backgroundColor: '#1c1c1c', // Dark background color
    borderRadius: 10, // Rounded corners
    padding: 10, // Padding for each item
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  movieImage: {
    width: 120,
    height: 180,
    marginRight: 15,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White color for title
    marginBottom: 5,
  },
  movieSummary: {
    fontSize: 11,
    color: '#aaa',
    marginRight:10,
    marginBottom: 10,
    lineHeight: 20, // Set the line height for proper text rendering
    maxHeight: 100, // Limit the height to show 5 lines
    overflow: 'hidden', // Hide excess text beyond 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#fff',
  },
  searchButton: {
    padding: 8,
    backgroundColor: 'skyblue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  showImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 8,
  },
  detailsContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  summary: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start', // Adjust as needed
  },
  buttonWrapper: {
    width: 150, // Example width
    marginTop: 10, // Example margin top
  },
});

// API endpoints
const BASE_URL = 'https://api.tvmaze.com';

// Home Screen
function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/search/shows?q=all`)
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.show.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Image source={{ uri: item.show.image?.medium }} style={styles.movieImage} />
            <View style={styles.buttonContainer}>
  <Text style={styles.movieTitle}>{item.show.name}</Text>
  <Text style={styles.movieSummary}>{item.show.summary}</Text>
  <View style={styles.buttonWrapper}>
    <Button
      title="View Details"
      onPress={() => navigation.navigate('Details', { show: item.show })}
    />
  </View>
</View>

          </View>
        )}
      />
    </View>
  );
}

// Search Screen
function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    axios
      .get(`${BASE_URL}/search/shows?q=${searchTerm}`)
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          onChangeText={(text) => setSearchTerm(text)}
        />
        <Button title="Search" onPress={handleSearch} style={styles.searchButton} />
      </View>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.show.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Image source={{ uri: item.show.image?.medium }} style={styles.movieImage} />
            <View>
              <Text style={styles.movieTitle}>{item.show.name}</Text>
              <Text style={styles.movieSummary}>{item.show.summary}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}


// Details Screen
function DetailsScreen({ route }) {
  const { show } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: show.image?.original }} style={styles.showImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{show.name}</Text>
        <Text style={styles.summary}>{show.summary.replace(/<[^>]*>?/gm, '')}</Text>
      </View>
    </ScrollView>
  );
}
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home"  options={{ headerShown: false }} component={HomeStack} />
        <Tab.Screen name="Search" component={SearchScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator  >
      <Stack.Screen name="Home"   component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export default App;