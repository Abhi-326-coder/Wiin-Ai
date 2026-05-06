import { Button } from "./ui/button";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const LogOutBtn = () => {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuthStore();

  const logOut = async () => {
    try {
      setLoading(true);
      await logout();
    } catch {
      // toast is already handled in store action
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={logOut}
      disabled={loading}
      className="hover:cursor-pointer"
    >
      {loading ? "Logging out..." : "Log Out"}
    </Button>
  );
};

export default LogOutBtn;
