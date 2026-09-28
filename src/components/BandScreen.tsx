import { StyleSheet, Text, View } from 'react-native';

// setting attributes of band screen
type BandScreenProps = {
    bandName: string;
};

// function for displaying the band information
export default function BandScreen({ bandName }: BandScreenProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>You're near:</Text>
            <Text style={styles.bandName}>{bandName}</Text>

        </View>
    );
}

// styling for the band screen
const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    title: {fontSize: 20},
    bandName: {fontSize: 32, fontWeight: 'bold', marginTop: 8},

});