import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import Searchbox from "../components/Searchbox";
import CreateGigModal from "../components/CreateGigModal";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const nav = useNavigate();

  //   const dummyGigs = [
  //     {
  //       gigId: 123,
  //       title: "Build a React Landing Page",
  //       description: "Need a responsive landing page for a startup.",
  //       budget: 3000,
  //       postedBy: "user123",
  //       status: "open",
  //     },
  //     {
  //       gigId: 124,
  //       title: "Fix Node.js API",
  //       description: "Authentication bugs need to be resolved.",
  //       budget: 2000,
  //       postedBy: "user456",
  //       status: "assigned",
  //     },
  //     {
  //       gigId: 125,
  //       title: "Design Logo",
  //       description: "Minimal logo for a tech brand.",
  //       budget: 1500,
  //       postedBy: "user789",
  //       status: "open",
  //     },
  //     {
  //       gigId: 128,
  //       title: "Design Logo",
  //       description: "Minimal logo for a tech brand.",
  //       budget: 1500,
  //       postedBy: "user789",
  //       status: "open",
  //     },
  //   ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/gigs");
        setData(res.data);
      } catch (error) {
        console.log("Some Error Occurred !");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => console.log("Socket Ready!"));

    socket.on("gigs_added", (value) => {
      console.log(value);
      setData(value);
    });

    return () => {
      socket.disconnect();
    };
  }, [data]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/gigs?search=${search}`);
      setData(res.data);
    } catch (error) {
      console.log("Some Error Occurred !");
    } finally {
      setLoading(false);
      setSearch("");
    }
  };

  const handleGig = (gigId) => {
    if (!gigId) return;
    console.log(gigId);
    nav(`/gig/${gigId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="px-10 lg:px-60 py-6 flex flex-col gap-6">
        {/* Search + Create Button */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Searchbox
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
          />
        </div>

        <div className="flex justify-end w-full">
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl  hover:bg-indigo-700 transition font-medium"
          >
            + Create Gig
          </button>
        </div>
        {/* Gigs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="flex items-center justify-center lg:w-[75vw] sm:w-[90vw] md:w-[85vw]">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 mt-3 text-lg">Loading data...</p>
              </div>
            </div>
          ) : (
            data?.map((gig, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleGig(gig._id)}
                  className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg text-gray-800">
                      {gig.title}
                    </h2>

                    <span
                      className={`text-sm px-3 py-1 rounded-full font-medium ${
                        gig.status === "open"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {gig.status}
                    </span>
                  </div>

                  <p className="text-md text-gray-600">{gig.description}</p>

                  <div className="mt-auto flex justify-between">
                    <p className="text-indigo-600 font-semibold">
                      ₹ {gig.budget}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && <CreateGigModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default HomePage;
