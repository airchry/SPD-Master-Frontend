import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "./api";

// 1. Tipe user (sesuaikan dengan /me API kamu)
interface User {
  id: string;
  email: string;
  // tambahin field lain kalau ada
}

// 2. Tipe context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// 3. Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Props Provider
interface AuthProviderProps {
  children: ReactNode;
}

// 5. Provider
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get<User>("/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 6. Custom hook (anti undefined)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
