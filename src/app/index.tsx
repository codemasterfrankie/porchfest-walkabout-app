/* 
brain of the app!
home screen, asks for location permission,
gets gps updates every 10 meters walked,
checks current time against festival time, and
loops over all performers playing now to find nearest porch.
if the nearest porch isn't within 50 meters, not shown
otherwise that band's screen is snown
*/

import * as Location from 'expo-location'; // location package for dealing with user location
import { useEffect, useState } from 'react';
import BandScreen from '../components/BandScreen';
import ComingSoonScreen from '../components/ComingSoonScreen';
import SeeYouNextYearScreen from '../components/SeeYouNextYearScreen';
import { PORCHES, type Porch } from '../data/porches'; // gets porch methods and data
import { getDistanceInMeters } from '../utils/distance'; // gets distance function
 
// below: type-checked Date objects
// actual start and end date for ithaca porchfest 2026, hard coded
const FESTIVAL_DAY = '2026-09-20';
const FESTIVAL_START = new Date(`${FESTIVAL_DAY}T12:00:00`);
const FESTIVAL_END = new Date(`${FESTIVAL_DAY}T18:00:00`);
const PROXIMITY_THRESHOLD_METERS = 50;
const SET_LENGTH_MINUTES = 60; // sets start on the hour, so assume each one lasts an hour

// for demo
const DEMO_MODE = true; // set to false during real festival
const DEMO_TIME = new Date('2026-09-20T06:00:00'); // before porchfest
//const DEMO_TIME = new Date('2026-09-20T12:10:00'); // 12:10
//const DEMO_TIME = new Date('2026-09-20T14:10:00'); // 2:10pm
//const DEMO_TIME = new Date('2026-09-20T16:10:00'); // 4:10pm
// below: no one playing at 920 n Tioga at 1, so program chooses neighbor at 914 (26 meters away)
//const DEMO_TIME = new Date('2026-09-20T13:10:00');
//const DEMO_TIME = new Date('2026-09-20T20:00:00'); // after porchfest
const DEMO_COORDS = { latitude: 42.4505498, longitude: -76.4976759}; // 920 N Tioga
//const DEMO_COORDS = { latitude: 42.4450934, longitude: -76.5009152}; // 111 1st st, Analog Breakdown
 
/*
Description: using the current time, checks if a band is playing right now and returns true or false
param: 
  startTime: string, starting time of a band's set
  now: Date object, current time
returns: boolean value
*/
function isPlayingNow(startTime: string, now: Date): boolean {
  const start = new Date(`${FESTIVAL_DAY}T${startTime}:00`);
  const end = new Date(start.getTime() + SET_LENGTH_MINUTES * 60 * 1000);
  return now >= start && now < end;
}

// exposes the Index() component to other modules
export default function Index() {
  // below var will either hold a location object or null
  // must have this so TS doesn't guess the type from the initial value
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const now = DEMO_MODE ? DEMO_TIME : new Date();
  const coords = DEMO_MODE ? DEMO_COORDS : location?.coords;
  const festActive = now >= FESTIVAL_START && now <= FESTIVAL_END;

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    /*
    Description: requests permission to access user's location; if denied, function returns;
    if accepted, location is watched and reset every 10 meters
    param: none
    return: no return, but side effect is the location is updated every 10 meters
    */
    async function watchLocation() { // keeps updating user location as they walk
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { // if user doesn't grand location permission
        setErrorMsg('Permission to access location was denied');
        return;
      }
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 }, // location checked every 10 meters
        (newLocation) => {
          console.log('CURRENT LOCATION:', newLocation.coords.latitude, newLocation.coords.longitude); // for debugging
          setLocation(newLocation);
        }
      );
    }
 
    watchLocation();
    return () => subscription?.remove(); // stop watching when the screen closes
  }, []); // note: the [] is the "dependency array", controls when the code inside useEffect runs

  let closestPorch: Porch | null = null;
  if (festActive && coords) {
    let nearbyPorch: Porch | null = null;
    let shortestDistance = Infinity;
 
    /*
    for loop iterates through all porches playing at porchfest, paying attention only to bands playing now
    */
    for (const porch of PORCHES) {
      if (!isPlayingNow(porch.startTime, now)) continue;
      const distance = getDistanceInMeters(
        coords.latitude,
        coords.longitude,
        porch.latitude,
        porch.longitude
      );
      if (distance < shortestDistance) { // infinity
        nearbyPorch = porch;
        shortestDistance = distance;
      }
    }
    console.log('Nearest porch with music:', nearbyPorch?.name, Math.round(shortestDistance), 'meters away'); // for debugging
 
    // returns band name of porch user is close to
    if (nearbyPorch && shortestDistance <= PROXIMITY_THRESHOLD_METERS) {
      closestPorch = nearbyPorch;
    }
  }

 
  const closestPorchId = closestPorch?.id;
  useEffect(() => {
    /*
    if there is a porch within proximity threshold, and that is the closest porch,
    add that porch to list of visited porches
    */
    if (closestPorchId) {
      setVisitedIds((prev) => (prev.includes(closestPorchId) ? prev :
    [...prev, closestPorchId]));
    }
  }, [closestPorchId]);

  if (now < FESTIVAL_START) {
    return <ComingSoonScreen />;
  }
  if (now > FESTIVAL_END) {
    const visitedPorches = PORCHES.filter((porch) => visitedIds.includes(porch.id));
    return <SeeYouNextYearScreen visitedPorches = {visitedPorches} />;
  }
  if (closestPorch) {
    return <BandScreen bandName={closestPorch.bandName} />;
  }
  return <ComingSoonScreen />;

  // todo: during fest but not near a porch, show 4th screen

}
 
