import {NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./Screens/HomeScreen";
import BudgetList from "./Screens/BudgetList";
import DormJobsList from "./Screens/DormJobsList";
import MessageScreen from "./Screens/MessageScreen";
import SignInScreen from "./Screens/SignInScreen";

const Stack = createNativeStackNavigator()

export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name = "Home" component = {HomeScreen}/>
        <Stack.Screen name = "BudgetList" component = {BudgetList}/>
        <Stack.Screen name = "DormJobsList" component = {DormJobsList}/>
        <Stack.Screen name = "MessageScreen" component = {MessageScreen}/>
        <Stack.Screen name = "SignInScreen" component = {SignInScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}