import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../utils/api";

const PageGuard = ({ children }) => {
  const { user, setUser } = useAuthContext();
  const nav = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/auth/profile");
        setUser(res.data);
      } catch (error) {
        console.log(error.message);
        setUser(null);
        nav("/login");
      }
    };

    if (!user) {
      fetchProfile();
    }
  }, [user, nav, setUser]);

  if (user === undefined)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-3 text-lg">Loading...</p>
        </div>
      </div>
    );

  return <div>{children}</div>;
};

export default PageGuard;
