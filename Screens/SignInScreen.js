import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { supabase } from "../lib/supabase.js";
import { Picker } from '@react-native-picker/picker'; // Import from the new package

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dorm, setDorm] = useState('Creekside'); // Default to Creekside
  const [isSigningUp, setIsSigningUp] = useState(false); // Track if user is signing up

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { dorm }
      }
    });

    if (error) {
      console.error('Error signing up:', error.message);
    } else {
      navigation.navigate('HomeScreen');
    }
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Error signing in:', error.message);
    } else {
      navigation.navigate('HomeScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSigningUp ? 'Sign Up' : 'Sign In'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {isSigningUp && (
        <Picker
          selectedValue={dorm}
          onValueChange={(itemValue) => setDorm(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Creekside" value="Creekside" />
          <Picker.Item label="Appletree" value="Appletree" />
          <Picker.Item label="Ridgeview" value="Ridgeview" />
        </Picker>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title={isSigningUp ? "Sign Up" : "Sign In"}
          onPress={isSigningUp ? handleSignUp : handleSignIn}
        />
      </View>
      <TouchableOpacity onPress={() => setIsSigningUp(!isSigningUp)}>
        <Text style={styles.switchText}>
          {isSigningUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    marginVertical: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  switchText: {
    marginTop: 20,
    color: '#007BFF',
    textAlign: 'center',
  }
});

export default SignInScreen;
