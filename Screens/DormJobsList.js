import {View, Text, StyleSheet} from "react-native";

export default function DormJobsList() {
    return(
        <View style = {styles.container}>
            <Text style = {styles.text}>
                Dorm Jobs List List Screen
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