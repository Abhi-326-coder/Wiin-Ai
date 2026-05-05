import { Button } from "./ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LogOutBtn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logOut = async () => {
    try {
      setLoading(true);

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

      toast.success(data?.message || "Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error in Logout");
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
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default LogOutBtn;
