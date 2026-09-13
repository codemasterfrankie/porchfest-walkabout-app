import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
//import { StyleSheet, Text, View } from 'react-native';
import BandScreen from '../components/BandScreen';
import ComingSoonScreen from '../components/ComingSoonScreen';
import SeeYouNextYearScreen from '../components/SeeYouNextYearScreen';
import { PORCHES } from '../data/porches';
import { getDistanceInMeters } from '../utils/distance';

// below: type-checked Date objects
// actual start and end date for ithaca porchfest 2026
const FESTIVAL_START = new Date('2026-09-20T12:00:00');
const FESTIVAL_END = new Date('2026-09-20T18:00:00');
const PROXIMITY_THRESHOLD_METERS = 50;

export default function Index() {
  // below var will either hold a location object or null
  // must have this so TS doesn't guess the type from the initial value
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getLocation() {
      const {status} = await Location.requestForegroundPermissionsAsync();
      // if location permission denied
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // if permission allowed, get location
      const currentLocation = await Location.getCurrentPositionAsync({});
      console.log('GOT LOCATION:', currentLocation.coords.latitude, currentLocation.coords.longitude);
      setLocation(currentLocation);
    }

    getLocation();
  }, []);
  // the [] is the "dependency array", controls when the code inside useEffect runs
  // get user location once (will update)

  const now = new Date('2026-09-20T13:00:00');

  if (now < FESTIVAL_START) {
    return <ComingSoonScreen />;
  }

  if (now > FESTIVAL_END) {
    return <SeeYouNextYearScreen />;
  }

  /**
  // temp debug screen to confirm gps working
  return (
    <View style={styles.container}>
      <Text styles={styles.label}>Debug: Location Data</Text>
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      {location && (
        <>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </>
      )}
      {!location && !errorMsg && <Text>Fetching location...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, justifyContent: 'center', alignItems: 'center'},
  label: {fontSize: 18, fontWeight: 'bold', marginBottom: 12},
  error: {color: 'red'},
});
*/

// festival is active, check dist to porch
if (location) {
  // "nearestPorch" will either be Porch object or undefined
  const nearestPorch = PORCHES.find((porch) => {
    const distance = getDistanceInMeters(
      location.coords.latitude,
      location.coords.longitude,
      porch.latitude,
      porch.longitude
    );
    return distance <= PROXIMITY_THRESHOLD_METERS;
  });

  if (nearestPorch) {
    return <BandScreen bandName={nearestPorch.bandName} />;

  }
}

// if during fest but not near any porch
return <ComingSoonScreen />;
}