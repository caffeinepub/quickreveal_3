import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Availability {
    day: string;
    isNight: boolean;
    date: string;
    time: bigint;
    isAvailable: boolean;
    isSunday: boolean;
}
export interface Salon {
    photoUrls: Array<string>;
    owner: Principal;
    isPremium: boolean;
    neighborhood: string;
    name: string;
    description: string;
    availabilities: Array<Availability>;
    services: Array<Service>;
}
export interface Service {
    name: string;
    durationMinutes: bigint;
    price: bigint;
}
export interface Booking {
    service: Service;
    client: Client;
    isNight: boolean;
    date: string;
    time: bigint;
    price: bigint;
    salonName: string;
    isSunday: boolean;
}
export type Client = Principal;
export interface UserProfile {
    xp: bigint;
    name: string;
    role: string;
    tier: LoyaltyTier;
}
export interface LoyaltyTier {
    tierName: string;
    requiredXP: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookSalon(salonName: string, time: bigint, date: string, _serviceName: string): Promise<void>;
    createSalon(name: string, neighborhood: string, description: string, photoUrls: Array<string>, services: Array<Service>, isPremium: boolean): Promise<void>;
    ensureSalonsSeeded(): Promise<void>;
    getBookings(salonName: string): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLoyaltyProfile(user: Principal): Promise<UserProfile | null>;
    getMyBookings(): Promise<Array<Booking>>;
    getSalon(name: string): Promise<Salon>;
    getSalons(): Promise<Array<Salon>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    resetLoyaltyProfiles(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
