import { PermissionsAndroid } from 'react-native';

export default requestGeolocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //console.log("Geolocation permission granted.");
    } else {
      //console.log("Geolocation permission denied.");
    }
  } catch (err) {
    //console.warn(err)
  }
}