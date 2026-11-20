/*
Description: using the haversine formula, getDistanceInMeters calculates the distance in meters between two lat/lon coordinates
params: it takes four numbers, lat1, lon1, lat2, lon2, where (lat1, lon1) and (lat2, lon2) are
sets of coordinates
return: a number, the distance between the two coordinates in meters
*/
// these equations were found online, not derived by hand
export function getDistanceInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371000; // earth's radius in meters
    /*
    Description: toRad converts degrees to radians
    param: takes a number, deg
    return: returns that number, deg, converted to radians
    */
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}