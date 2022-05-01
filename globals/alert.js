import { Alert } from "react-native";

export function handleFetchError() {
  Alert.alert(
    "Failed to fetch data.",
    "Your network connection may be unstable, or the server may be experiencing interruptions. Please try again later."
  );
  return;
}
