import * as Application from "expo-application";
import * as Device from "expo-device";

export const getFingerprint = async (): Promise<string> => {
  let androidId = null;

  try {
    androidId = await Application.getAndroidId();
  } catch (e) {
    console.warn("Unable to get Android ID:", e);
  }

  // If we have an Android ID, use that
  if (androidId) return androidId;

  // Otherwise, fallback to a composite string
  return `${Device.osName}-${Device.osVersion}-${Application.nativeApplicationVersion}-${Application.nativeBuildVersion}`;
};
