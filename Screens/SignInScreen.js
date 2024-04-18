import {View, Text, StyleSheet} from "react-native";

export default function SignInScreen() {
    return(
        <View style = {styles.container}>
            <Text style = {styles.text}>
                Sign In Screen
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text : {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 16,
    },
});