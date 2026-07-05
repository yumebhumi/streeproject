"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export interface AuthUser {
  _id?: string;
  userName?: string;
  email?: string;
  isAdmin?: boolean;
  profileImage?: string;
}

export interface Incident {
  _id: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: { type: string; coordinates: number[] };
  name?: string;
  isAnonymous?: boolean;
  status?: string;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  storeTokenInLS: (serverToken: string) => void;
  LogoutUser: () => void;
  user: AuthUser | null;
  token: string | null;
  getUserIncidents: () => Promise<Incident[]>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Read the persisted token on the client only (avoids SSR localStorage access).
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const storeTokenInLS = (serverToken: string) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const LogoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  const isLoggedIn = !!token;

  const userAuthentication = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${backendUrl}/api/auth/getUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

      const data = await response.json();
      setUser(data.userData);
    } catch (error) {
      console.error("error from userAuthentication : ", error);
    }
  }, [token]);

  const getUserIncidents = useCallback(async (): Promise<Incident[]> => {
    try {
      const response = await fetch(`${backendUrl}/api/users/incidents`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.incidents;
      }
    } catch (error) {
      console.error("error from getUserIncidents : ", error);
    }
    return [];
  }, [token]);

  useEffect(() => {
    userAuthentication();
  }, [userAuthentication]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        LogoutUser,
        user,
        token,
        getUserIncidents,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
