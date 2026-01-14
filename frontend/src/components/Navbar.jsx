import { useState, useRef, useEffect } from "react";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { io } from "socket.io-client";
import { useAuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, hasNewNotification] = useState(false);
  const nav = useNavigate();
  const { user } = useAuthContext();

  const notifRef = useRef(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => console.log("Socket Ready!"));

    socket.on("hired", (data) => {
      if (user && user._id === data.user._id) {
        const notifyPara = `You have been hired for ${data.gig.title}`;
        setNotifications((prev) => [...prev, notifyPara]);
        hasNewNotification(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
        hasNewNotification(false);
      }
    };

    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifOpen]);

  const handleLogout = async () => {
    await api.post("/api/auth/logout");
    nav("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md px-9 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-indigo-600">GigFlow</div>

        {/* NavKeys */}
        <div className="hidden md:flex gap-10 text-gray-700 text-lg font-semibold">
          <button onClick={() => nav("/")} className="hover:text-indigo-600">
            Home
          </button>
          <button
            onClick={() => nav("/applied-gigs")}
            className="hover:text-indigo-600"
          >
            Applied Gigs
          </button>
          <button
            onClick={() => nav("/posted-gigs")}
            className="hover:text-indigo-600"
          >
            Posted Gigs
          </button>
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Notification */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Bell size={22} />
            </button>

            {newNotification && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            )}

            {notifOpen && (
              <div className="absolute right-0 w-96 h-64 bg-white shadow-lg rounded-xl p-4 z-50 overflow-y-auto mt-5">
                <h3 className="font-semibold mb-3 text-lg">Notifications</h3>
                {notifications.length >= 1 ? (
                  notifications?.map((notification) => (
                    <div className="space-y-3 text-sm text-gray-600">
                      <p>✅ {notification}</p>
                    </div>
                  ))
                ) : (
                  <p> No notifications yet!</p>
                )}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden md:block p-2 rounded-full hover:bg-gray-100"
          >
            <LogOut size={22} />
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 bg-gray-50 p-4 rounded-lg">
          <button onClick={() => nav("/")}>Home</button>
          <button onClick={() => nav("/applied-gigs")}>Applied Gigs</button>
          <button onClick={() => nav("/posted-gigs")}>Posted Gigs</button>

          <button className="flex items-center gap-2 text-red-600 mt-2">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
