import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { SignInResponse, SignInResponseSchema } from "../types";

type AuthState = "authenticated" | "unauthenticated" | "loading";

export type AuthContextType = {
  authState: AuthState;
  user: SignInResponse | null;
  login: (user: SignInResponse) => void;
  logout: () => void;
};

const deriveAuthState = ({
  user,
  isLoading,
}: {
  user: SignInResponse | null;
  isLoading: boolean;
}): AuthState => {
  if (isLoading) return "loading";
  if (user) {
    return "authenticated";
  } else return "unauthenticated";
};

const clearUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("tokenExpiration");
};

const getUserFromLocalStorage = (): SignInResponse | null => {
  const userFromLocalStorage = localStorage.getItem("user");
  const tokenExpiration = localStorage.getItem("tokenExpiration");

  if (!userFromLocalStorage || !tokenExpiration) {
    clearUser();
    return null;
  }

  if (new Date().getTime() > parseInt(tokenExpiration)) {
    clearUser();
    return null;
  }

  try {
    return SignInResponseSchema.parse(JSON.parse(userFromLocalStorage));
  } catch (_e) {
    clearUser();
    return null;
  }
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<null | SignInResponse>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authState = deriveAuthState({ user, isLoading });

  const logout = async () => {
    setIsLoading(true);
    clearUser();
    setUser(null);
    setIsLoading(false);
  };

  const login = (data: SignInResponse) => {
    setIsLoading(false);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    // Set token expiration to 24 hours from now
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("tokenExpiration", expirationTime.toString());
  };

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (!user) {
      setIsLoading(false);
      setUser(null);
      return;
    }
    login(user);
  }, []);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const user = getUserFromLocalStorage();
      if (!user) {
        logout();
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        authState,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used with an AuthProvider");
  }
  return context;
}
