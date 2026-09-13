import { StyleSheet, Text, View } from 'react-native';

export default function SeeYouNextYearScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>See You Next Year!</Text>
            <Text style={styles.subtitle}>Thanks for coming to Porchfest.</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    title: {fontSize: 28, fontWeight: 'bold'},
    subtitle: {fontSize: 16, marginTop: 8},
});