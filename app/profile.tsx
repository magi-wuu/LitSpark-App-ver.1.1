import { Redirect } from 'expo-router';
/** Keep existing profile links working after adding the main tab navigator. */
export default function Profile() { return <Redirect href="/account" />; }
