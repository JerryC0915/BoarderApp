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
import { Picker } from '@react-native-picker/picker'; 
import { CommonActions } from '@react-navigation/native';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dorm, setDorm] = useState('Creekside');
  const [isSigningUp, setIsSigningUp] = useState(false); 

  const handleSignUp = async () => {
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error('Error signing up:', signUpError.message);
        return;
      }

      const user = signUpData.user;
      
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, email, dorm, role: 'student' }]);

        if (profileError) {
          console.error('Error creating profile:', profileError.message);
          return;
        }
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        })
      );
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Error signing in:', error.message);
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
          })
        );
      }
    } catch (error) {
      console.error('Error:', error.message);
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
    justifyContent: 'center',
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
