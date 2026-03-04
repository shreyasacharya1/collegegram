import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

type User = {
  _id: string;
  fullName: string;
  email: string;
  collegeName: string;
  yearOfStudy: number;
  branch: string;
  bio: string;
  isSenior: boolean;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  ready: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("cg_token"));
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setReady(true);
        return;
      }

      try {
        const { data } = await api.get<User>("/auth/me");
        setUser(data);
      } catch {
        localStorage.removeItem("cg_token");
        setToken(null);
        setUser(null);
      } finally {
        setReady(true);
      }
    };

    load();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      setAuth: (nextToken: string, nextUser: User) => {
        localStorage.setItem("cg_token", nextToken);
        setToken(nextToken);
        setUser(nextUser);
      },
      logout: () => {
        localStorage.removeItem("cg_token");
        setToken(null);
        setUser(null);
      }
    }),
    [ready, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("Auth context missing");
  return ctx;
};
