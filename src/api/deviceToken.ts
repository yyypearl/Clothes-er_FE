import AuthAxios from "./authAxios";
import { getToken } from "firebase/messaging";
import { messaging } from "../core/notification/settingFCM";

export async function getDeviceToken() {
  if (typeof window === "undefined") return null;

   const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
  })
  console.log("디바이스 토큰 가져오기 성공");
  console.log("Device Token: ", token);
  return token;
}

export async function patchDeviceToken(token: string) {
  if (typeof window === "undefined") return null;

  try {
    const response = await AuthAxios.patch(`/api/v1/notifications/token`, {
      deviceToken: token,
    });
    console.log("디바이스 토큰 저장 성공");
    return response.data;
  } catch (error) {
    console.log("디바이스 토큰 저장 실패");
    throw error;
  }
}
