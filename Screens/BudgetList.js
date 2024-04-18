import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Image} from "react-native";

export default function BudgetList() {
    return(
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.TotalBudget}>Total Budget: </Text>
            <TouchableOpacity onPress={console.log("Edit Budget")} style={styles.button}>
                <Text>Edit Budget</Text>
            </TouchableOpacity>
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    TotalBudget: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop:20,
        marginLeft: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 50,
    },
    button: {
        backgroundColor: '#ddd',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
        marginTop: 20,
      },
});