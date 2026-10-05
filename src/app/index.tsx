import * as Location from 'expo-location'; // location package for dealing with user location
import { useEffect, useState } from 'react';
import BandScreen from '../components/BandScreen'; // gets the band screen component
import ComingSoonScreen from '../components/ComingSoonScreen'; // gets the coming soon screen component
import SeeYouNextYearScreen from '../components/SeeYouNextYearScreen'; // gets the see you next year screen component
import { PORCHES, type Porch } from '../data/porches'; // gets porch methods and data
import { getDistanceInMeters } from '../utils/distance'; // gets distance function
 
// below: type-checked Date objects
// actual start and end date for ithaca porchfest 2026
const FESTIVAL_DAY = '2026-09-20';
const FESTIVAL_START = new Date(`${FESTIVAL_DAY}T12:00:00`);
const FESTIVAL_END = new Date(`${FESTIVAL_DAY}T18:00:00`);
const PROXIMITY_THRESHOLD_METERS = 50; // setting the distance from porch
const SET_LENGTH_MINUTES = 60; // sets start on the hour, so assume each one lasts an hour
 
// true if this performance is happening at time "now"
function isPlayingNow(startTime: string, now: Date): boolean {
  const start = new Date(`${FESTIVAL_DAY}T${startTime}:00`);
  const end = new Date(start.getTime() + SET_LENGTH_MINUTES * 60 * 1000);
  return now >= start && now < end;
}
 
export default function Index() {
  // below var will either hold a location object or null
  // must have this so TS doesn't guess the type from the initial value
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
 
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
 
    async function watchLocation() { // keeps updating user location as they walk
      const { status } = await Location.requestForegroundPermissionsAsync();
      // if location permission denied
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
 
      // if permission allowed, get a new location every time the user moves 10+ meters
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (newLocation) => {
          console.log('GOT LOCATION:', newLocation.coords.latitude, newLocation.coords.longitude);
          setLocation(newLocation);
        }
      );
    }
 
    watchLocation();
    return () => subscription?.remove(); // stop watching when the screen closes
  }, []);
  // the [] is the "dependency array", controls when the code inside useEffect runs
 
  // hard coded for debugging -- switch to `new Date()` for the real clock
  const now = new Date('2026-09-20T15:10:00');
 
  // checking current time with festival start and end times, returning the correct screen
  if (now < FESTIVAL_START) {
    return <ComingSoonScreen />;
  }
 
  if (now > FESTIVAL_END) {
    return <SeeYouNextYearScreen />;
  }
 
  // festival is active, find the closest porch with a band playing right now
  if (location) {
    let nearestPorch: Porch | null = null;
    let nearestDistance = Infinity;
 
    for (const porch of PORCHES) {
      if (!isPlayingNow(porch.startTime, now)) continue; // skip bands not playing now
 
      const distance = getDistanceInMeters(
        location.coords.latitude,
        location.coords.longitude,
        porch.latitude,
        porch.longitude
      ); // calculates distance from user to porch
 
      if (distance < nearestDistance) {
        nearestPorch = porch;
        nearestDistance = distance;
      }
    }
    console.log('Nearest playing porch:', nearestPorch?.name, Math.round(nearestDistance), 'meters'); // for debugging
 
    // returns band name of porch user is close to
    if (nearestPorch && nearestDistance <= PROXIMITY_THRESHOLD_METERS) {
      return <BandScreen bandName={nearestPorch.bandName} />;
    }
  }
 
  // if during fest but not near any porch
  return <ComingSoonScreen />;
}
 
