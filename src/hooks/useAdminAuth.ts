import { useEffect, useState } from "react";
import { adminLogin, adminLogout, hasAdminToken } from "@/lib/membershipDb";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => hasAdminToken());

  useEffect(() => {
    setIsAuthenticated(hasAdminToken());
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await adminLogin(username, password);
      setIsAuthenticated(true);
      return true;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    adminLogout();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}
