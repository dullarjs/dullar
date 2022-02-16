import { AnyObject } from "@/types";

export const isPromise = (obj: AnyObject) => {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
};