import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const frontendurl = "https://care-nest-teal.vercel.app";
export const backendurl = "https://api.careworks.biz";
export const cdnURL = "https://carenest-storage.ap-south-1.storage.onantryk.com";

