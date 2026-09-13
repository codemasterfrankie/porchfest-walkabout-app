import { StyleSheet, Text, View } from 'react-native';
// imports building blocks from react native
// View is a container, like <div>
// Text for displaying words
// StyleSheet for writing styles

export default function ComingSoonScreen() {
    // declares component (reusable UI)
    // export default makes it importable from other files
    // so index.tsx will import this

    return (
        // this is jsx, html-like syntax inside js
        // draw container View and put inside 2 lines of text
        // style=... point each element to its styling
        <View style={styles.container}>
            <Text style={styles.title}>Coming Soon</Text>
            <Text style={styles.subtitle}>Porchfest starts soon!</Text>
        </View>
    );
}

// styles are defined below
const styles = StyleSheet.create({
    // flex 1 makes container fill whole screen
    // justifycontent and alignitems center everything vertically and horizontally
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold'},
    subtitle: { fontSize: 16, marginTop: 8},
});