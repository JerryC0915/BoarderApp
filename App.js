import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./Screens/HomeScreen";
import BudgetList from "./Screens/BudgetList";
import DormJobsList from "./Screens/DormJobsList";
import DutyPerson from "./Screens/DutyPerson";
import Auth from "./Screens/SignInScreen";
import "react-native-url-polyfill/auto"
import { useState, useEffect } from "react"
import { supabase } from "./lib/supabase.js"

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={session ? "HomeScreen" : "SignInScreen"}>
        {session ? (
          <>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="BudgetList" component={BudgetList} />
            <Stack.Screen name="DormJobsList" component={DormJobsList} />
            <Stack.Screen name="DutyPerson" component={DutyPerson} />
          </>
        ) : (
          <Stack.Screen name="SignInScreen" component={Auth} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
