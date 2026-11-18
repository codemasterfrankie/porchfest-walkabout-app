// screen when festival is over (v1)

import { ScrollView, StyleSheet, Text } from 'react-native';
import type { Porch } from '../data/porches';

type SeeYouNextYearScreenProps = {
    visitedPorches: Porch[]; // chronological array of bands visited
};

export default function SeeYouNextYearScreen({ visitedPorches } : SeeYouNextYearScreenProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>See You Next Year!</Text>
            <Text style={styles.subtitle}>Thanks for coming to Porchfest.</Text>

        {visitedPorches.length > 0 ? (
            <>
                <Text style={styles.listTitle}>Bands you walked by:</Text>
                {visitedPorches.map((porch) => (
                    <Text key={porch.id} style={styles.band}>{porch.bandName}</Text>
                ))}
            </>
        ) : null}
    </ScrollView>
    );
}

// styles for see you later screen
const styles = StyleSheet.create({
    container: {flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24},
    title: {fontSize: 28, fontWeight: 'bold'},
    subtitle: {fontSize: 16, marginTop: 8},
    listTitle: {fontSize: 18, fontWeight: 'bold', marginTop: 32, marginBottom: 8},
    band: {fontSize: 16, marginTop: 4},
});