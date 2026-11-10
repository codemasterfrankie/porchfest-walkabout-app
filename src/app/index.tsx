// brain of the app!
// this is the hope screen: asks for location permission,
// gets gps updates every 10 meters walked,
// checks current time against festival time, and
// loops over all performers playing now and finds nearest porch
// if the nearest porch isn't within 50 meters, not shown
// otherwise that band's screen is snown

import * as Location from 'expo-location'; // location package for dealing with user location
import { useEffect, useState } from 'react';
import BandScreen from '../components/BandScreen'; // gets the band screen component
import ComingSoonScreen from '../components/ComingSoonScreen'; // gets the coming soon screen component
import SeeYouNextYearScreen from '../components/SeeYouNextYearScreen'; // gets the see you next year screen component
import { PORCHES, type Porch } from '../data/porches'; // gets porch methods and data
import { getDistanceInMeters } from '../utils/distance'; // gets distance function
 
// below: type-checked Date objects
// actual start and end date for ithaca porchfest 2026, hard coded
const FESTIVAL_DAY = '2026-09-20';
const FESTIVAL_START = new Date(`${FESTIVAL_DAY}T12:00:00`);
const FESTIVAL_END = new Date(`${FESTIVAL_DAY}T18:00:00`);
const PROXIMITY_THRESHOLD_METERS = 50; // setting the distance from porch
const SET_LENGTH_MINUTES = 60; // sets start on the hour, so assume each one lasts an hour

// for demo
const DEMO_MODE = true; // set to false during real festival
//const DEMO_TIME = new Date('2026-09-20T06:00:00'); // before porchfest
//const DEMO_TIME = new Date('2026-09-20T12:10:00'); // 12:10
//const DEMO_TIME = new Date('2026-09-20T14:10:00'); // 2:10pm
//const DEMO_TIME = new Date('2026-09-20T16:10:00'); // 4:10pm
// below: no one playing at 920 n Tioga at 1, so program chooses neighbor at 914 (26 meters away)
//const DEMO_TIME = new Date('2026-09-20T13:10:00');
const DEMO_TIME = new Date('2026-09-20T20:00:00'); // after porchfest

const DEMO_COORDS = { latitude: 42.4505498, longitude: -76.4976759}; // 920 N Tioga

//const DEMO_COORDS = { latitude: 42.4450934, longitude: -76.5009152}; // 111 1st st, Analog Breakdown
 
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
 
  // right now
  const now = DEMO_MODE ? DEMO_TIME : new Date();
 
  // checking current time with festival start and end times, returning the correct screen
  if (now < FESTIVAL_START) {
    return <ComingSoonScreen />;
  }
 
  if (now > FESTIVAL_END) {
    return <SeeYouNextYearScreen />;
  }

  // for demo
  // if demo mode is on, use DEMO_COORDS, else use location?.coords
  const coords = DEMO_MODE ? DEMO_COORDS : location?.coords;
 
  // festival is active, find the closest porch with a band playing right now
  if (coords) {
    let nearestPorch: Porch | null = null;
    let nearestDistance = Infinity;
 
    for (const porch of PORCHES) {
      if (!isPlayingNow(porch.startTime, now)) continue; // skip bands not playing now
 
      const distance = getDistanceInMeters(
        coords.latitude,
        coords.longitude,
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
 
