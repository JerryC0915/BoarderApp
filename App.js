import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./Screens/HomeScreen";
import BudgetList from "./Screens/BudgetList";
import DormJobsList from "./Screens/DormJobsList";
import Calender from "./Screens/Calender";
import Auth from "./Screens/SignInScreen";
import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase.js";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (error) {
          console.error('Error fetching user role:', error);
        } else {
          setUserRole(data.role);
        }
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        const fetchRole = async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          if (error) {
            console.error('Error fetching user role:', error);
          } else {
            setUserRole(data.role);
          }
        };
        fetchRole();
      } else {
        setUserRole(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={session ? "HomeScreen" : "SignInScreen"}>
          <Stack.Screen name="HomeScreen">
            {props => <HomeScreen {...props} userRole={userRole} />}
          </Stack.Screen>
          <Stack.Screen name="BudgetList" component={BudgetList} />
          <Stack.Screen name="DormJobsList" component={DormJobsList} />
          <Stack.Screen name="Calender" component={Calender} />
          <Stack.Screen name="SignInScreen" component={Auth} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
