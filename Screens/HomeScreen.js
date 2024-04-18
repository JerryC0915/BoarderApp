import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';

const HomeScreen = ({navigation}) => {
  const handleBudgetPress = () => {
    navigation.navigate("BudgetList");
  };

  const handleDormJobsPress = () => {
    navigation.navigate("DormJobsList");
  };

  const handleMessagePress = () => {
    navigation.navigate("MessageScreen");
  };

  const handleSignOutPress = () => {
    navigation.navigate("SignInScreen");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://cnas.ucr.edu/sites/default/files/styles/form_preview/public/default-profile.jpg?itok=UCHDPglp' }}
          style={styles.profilePic}
        />
        <Text style={styles.name}>Duty Person: </Text>
        <View>
            <TouchableOpacity onPress={handleSignOutPress} style={styles.button}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity onPress={handleBudgetPress} style={styles.buttonSection}>
          <Text style={styles.sectionTitle}>Budget List:</Text>
          <Image
            source = {{uri: 'https://cdn-icons-png.flaticon.com/512/4604/4604286.png'}}
            style = {styles.ButtonPic}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDormJobsPress} style={styles.buttonSection}>
          <Text style={styles.sectionTitle}>Dorm Jobs List:</Text>
          <Image
            source = {{uri: 'https://cdn-icons-png.flaticon.com/512/5027/5027336.png'}}
            style = {styles.ButtonPic}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleMessagePress} style={styles.buttonSection}>
          <Text style={styles.sectionTitle}>Message:</Text>
          <Image
            source = {{uri: 'https://images.vexels.com/media/users/3/136808/isolated/preview/d3455a22af5f3ed7565fb5fb71bb8d43-send-message-icon.png'}}
            style = {styles.ButtonPic}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 12,
  },
  ButtonPic: {
    width: 70,
    height: 70,
    borderRadius: 25,
    marginTop:10,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#ddd',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  buttonSection: {
    backgroundColor: '#eee',
    padding: 20,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default HomeScreen;
