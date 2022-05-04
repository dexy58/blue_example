import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { PermissionsAndroid } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const manager = new BleManager();

  useEffect(() => {
    const subscription = manager.onStateChange(async (state) => {
      if (state === "PoweredOn") {
        const permission = await requestLocationPermission();
        console.log("permission: ", permission);
        if (permission) {
          subscription.remove();
        }
      }
    }, true);
  });

  async function requestLocationPermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Permição para Bluetooth BLE",
        message: "Este App pode acessar o Bluetooth LE. ",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the Bluetooth LE");
      return true;
    } else {
      console.log("Bluetooth LE permission denied");
      return false;
    }
  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
