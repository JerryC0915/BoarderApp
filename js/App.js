import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./Screens/HomeScreen";
import BudgetList from "./Screens/BudgetList";
import DormJobsList from "./Screens/DormJobsList";
import MessageScreen from "./Screens/MessageScreen";
import SignInScreen from "./Screens/SignInScreen";
import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './Screens/SignInScreen';
import Account from './Components/Account';
import { View } from 'react-native';
import { Session } from '@supabase/supabase-js';
const Stack = createNativeStackNavigator();
export default function App() {
    const [session, setSession] = useState < Session | null > (null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);
    return (<NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="BudgetList" component={BudgetList}/>
        <Stack.Screen name="DormJobsList" component={DormJobsList}/>
        <Stack.Screen name="MessageScreen" component={MessageScreen}/>
        <Stack.Screen name="SignInScreen" component={SignInScreen}/>
      </Stack.Navigator>
      <View>
      {session && session.user ? <Account key={session.user.id} session={session}/> : <Auth />}
    </View>
    </NavigationContainer>);
}
