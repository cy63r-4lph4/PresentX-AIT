import { getFingerprint } from "./getFingerPrint";
import SHA256 from "crypto-js/sha256";


export const getHashedFingerprint = async (): Promise<string> => {
  const rawFingerprint = await getFingerprint();
  return SHA256(rawFingerprint).toString();
};
