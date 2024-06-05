import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { supabase } from "../lib/supabase.js";

const HomeScreen = ({ navigation }) => {
  const [userRole, setUserRole] = useState('');
  const [selectedDorm, setSelectedDorm] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
        return;
      }
      if (session) {
        const user = session.user;
        console.log('Fetched user:', user);
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('role, dorm')
            .eq('id', user.id)
            .single();
          if (error) {
            console.error('Error fetching user role:', error.message);
          } else {
            console.log('Fetched user role and dorm:', data.role, data.dorm);
            setUserRole(data.role);
            setSelectedDorm(data.dorm); 
          }
        } else {
          console.error('No authenticated user found');
        }
      } else {
        console.error('No active session found');
      }
    };

    fetchUserRole();
  }, []);

  const handleBudgetPress = () => {
    console.log('Navigating to BudgetList with dorm:', selectedDorm);
    navigation.navigate("BudgetList", { dorm: selectedDorm });
  };

  const handleDormJobsPress = () => {
    console.log('Navigating to DormJobsList with dorm:', selectedDorm);
    navigation.navigate("DormJobsList", { dorm: selectedDorm });
  };

  const handleCalenderPress = () => {
    navigation.navigate("Calender");
  };

  const handleSignOutPress = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      console.log('Signed out successfully');
      navigation.reset({
        index: 0,
        routes: [{ name: "SignInScreen" }],
      });
    } else {
      console.error('Sign out error: ', error.message);
    }
  };

  const handleDormSwitch = (dorm) => {
    console.log('Switching dorm to:', dorm);
    setSelectedDorm(dorm);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://cnas.ucr.edu/sites/default/files/styles/form_preview/public/default-profile.jpg?itok=UCHDPglp' }}
          style={styles.profilePic}
        />
        <Text style={styles.name}>Boarder App</Text>
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
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4604/4604286.png' }}
            style={styles.ButtonPic}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDormJobsPress} style={styles.buttonSection}>
          <Text style={styles.sectionTitle}>Dorm Jobs List:</Text>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5027/5027336.png' }}
            style={styles.ButtonPic}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCalenderPress} style={styles.buttonSection}>
          <Text style={styles.sectionTitle}>Calendar:</Text>
          <Image
            source={{ uri: 'https://www.freeiconspng.com/thumbs/calendar-icon-png/calendar-date-event-month-icon--19.png' }}
            style={styles.ButtonPic}
          />
        </TouchableOpacity>
        {userRole === 'admin' && (
          <View style={styles.adminControls}>
            <Text>Switch Dorm:</Text>
            <TouchableOpacity onPress={() => handleDormSwitch('Creekside')} style={styles.switchButton}>
              <Text>Creekside</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDormSwitch('Appletree')} style={styles.switchButton}>
              <Text>Appletree</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDormSwitch('Ridgeview')} style={styles.switchButton}>
              <Text>Ridgeview</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginTop: 10,
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
  adminControls: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  switchButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  }
});

export default HomeScreen;
