import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Goal {
    id: GoalId;
    title: string;
    createdAt: Time;
    description: string;
    isArchived: boolean;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export type GoalId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    archiveGoal(goalId: GoalId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createGoal(title: string, description: string): Promise<void>;
    getActiveGoals(): Promise<Array<Goal>>;
    getArchivedGoals(): Promise<Array<Goal>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGoalsForDay(dayTimestamp: Time): Promise<Array<[Goal, boolean]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleGoalCompletion(goalId: GoalId, dayTimestamp: Time): Promise<void>;
}
