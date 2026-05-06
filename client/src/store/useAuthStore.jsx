import {create} from 'zustand';
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) =>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    checkAuth : async () => {
        try {
            const res = await fetch("/api/auth/checkAuth", {
                credentials: "include",
            });
            if (!res.ok) {
                throw new Error("Not authenticated");
            }
            const data = await res.json();
            set({authUser : data});
        } catch (error) {
            console.log("Error in checkAuth : ", error);
            set({authUser : null});
        } finally {
            set({isCheckingAuth : false});
        }
    },
    signup : async ({ fullName, email, password }) => {
        set({ isSigningUp: true });
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ fullName, email, password }),
            });

            let data = null;
            try {
                data = await res.json();
            } catch {
                data = null;
            }

            if (!res.ok) {
                throw new Error(data?.message || data?.error || "Sign up failed");
            }

            set({ authUser: data });
            toast.success("Account created successfully");
            return data;
        } catch (error) {
            console.error("Error in signup:", error);
            toast.error(error.message || "Unable to sign up");
            throw error;
        } finally {
            set({ isSigningUp: false });
        }
    },
    login : async ({ email, password }) => {
        set({ isLoggingIn: true });
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            let data = null;
            try {
                data = await res.json();
            } catch {
                data = null;
            }

            if (!res.ok) {
                throw new Error(data?.message || data?.error || "Login failed");
            }

            set({ authUser: data });
            toast.success("Logged in successfully");
            return data;
        } catch (error) {
            console.error("Error in login:", error);
            toast.error(error.message || "Unable to login");
            throw error;
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout : async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            let data = null;
            try {
                data = await res.json();
            } catch {
                data = null;
            }

            if (!res.ok) {
                throw new Error(data?.message || data?.error || "Logout failed");
            }

            set({ authUser: null });
            toast.success(data?.message || "Logged out successfully");
        } catch (error) {
            console.error("Error in logout:", error);
            toast.error(error.message || "Error in Logout");
            throw error;
        }
    }
}) )