import { userType } from "./Interfaces";

export function getCurrentUser(): userType | null{
    try {
        const user = document.cookie.split(';').find(cookie => cookie.includes('user'))?.split('=')[1] as string;
        if (!user) return null;
        return JSON.parse(decodeURIComponent(user));
    } catch (error) {
        return null;
    }
}