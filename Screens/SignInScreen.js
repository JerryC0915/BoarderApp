import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase.js';

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle user login
    const handleLogin = async () => {
        const { user, session, error } = await supabase.auth.signIn({
            email: email,
            password: password
        });

        if (error) {
            Alert.alert('Login Failed', error.message);
        } else {
            Alert.alert('Success', 'Logged in successfully!');
        }
    };

    // Function to handle user registration
    const handleSignUp = async () => {
        const { user, session, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            Alert.alert('Registration Failed', error.message);
        } else {
            Alert.alert('Success', 'Registration successful. Please check your email to verify.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCorrect={false}
            />
            <Button title="Log In" onPress={handleLogin} />
            <Button title="Sign Up" onPress={handleSignUp} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
    }
});

export default SignInScreen;
