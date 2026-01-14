import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

// const dummyData = {
//   gig: {
//     _id: "gig123",
//     title: "Build a React Landing Page",
//     description: "Need a responsive landing page for a startup.",
//     budget: 3000,
//     ownerId: "user001",
//     status: "open",
//   },
//   bids: [
//     {
//       _id: "bid001",
//       gigId: "gig123",
//       freelancerId: "user101",
//       bidAmount: 2500,
//       message: "I can deliver this in 3 days with clean UI.",
//       status: "pending",
//     },
//     {
//       _id: "bid002",
//       gigId: "gig123",
//       freelancerId: "user102",
//       bidAmount: 2800,
//       message: "Experienced React dev here. Ready to start.",
//       status: "pending",
//     },
//   ],
// };

const GigDetails = () => {
  const { user } = useAuthContext();
  const [data, setData] = useState(null); // { gig: {}, bids: [] }
  const [isClient, setIsClient] = useState(false); // to ensure if the gig is posted by loggedIn user it should not show Hire button

  const [showBidForm, setShowBidForm] = useState(false);
  const [bidMessage, setBidMessage] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const [bidMessageError, setBidMessageError] = useState("");
  const [bidAmountError, setBidAmountError] = useState("");

  const location = useLocation();
  const path = location.pathname;
  const gig = path.split("/");
  const gigId = gig[2];

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => console.log("Socket Ready!"));

    socket.on("bids_updated", (data) => {
      if (gigId === data.gigId) {
        setData((prev) => ({
          ...prev,
          bids: data.bids,
        }));
      }
    });

    socket.on("bid_status", (data) => {
      console.log(data);
      if (gigId == data.gigId) {
        setData((prev) => ({
          ...prev,
          bids: data.bids,
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [gigId]);

  const fetchBids = async () => {
    const res = await api.get(`/api/bids/${gigId}`);
    console.log(res.data);

    const { gig, bids } = res.data;
    console.log(user);

    if (gig.ownerId === user._id) {
      setIsClient(true);
    } else {
      setIsClient(false);
      setShowBidForm(true);
    }

    setData({ gig, bids });
  };

  useEffect(() => {
    try {
      fetchBids();
    } catch (error) {
      console.log("Some error occurred", error.message);
    }
  }, [gigId]);

  const validateBidMessage = (value) => {
    if (!value) {
      setBidMessageError("Message is required");
      return false;
    }
    setBidMessageError("");
    return true;
  };

  const validateBidAmount = (value) => {
    if (!value) {
      setBidAmountError("Budget is required");
      return false;
    }
    if (isNaN(value) || Number(value) <= 0) {
      setBidAmountError("Enter a valid amount");
      return false;
    }
    setBidAmountError("");
    return true;
  };

  if (!data) {
    return (
      <>
        <Navbar></Navbar>
        <div className="flex items-center justify-center mt-60">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 mt-3 text-lg">
              Fetching gig details...
            </p>
          </div>
        </div>
      </>
    );
  }

  const handleHire = async (bidId) => {
    console.log(bidId);
    const res = await api.patch(`/api/bids/${bidId}/hire`);
    console.log(res);
  };

  const handlePlaceBid = async () => {
    const isMessageValid = validateBidMessage(bidMessage);
    const isAmountValid = validateBidAmount(bidAmount);

    if (!isMessageValid || !isAmountValid) return;

    console.log(bidMessage, bidAmount);

    await api.post("/api/bids", {
      gigId,
      bidAmount,
      message: bidMessage,
    });

    setBidMessage("");
    setBidAmount("");
  };

  return (
    <>
      <Navbar />

      {data && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  {data?.gig.title}
                </h1>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    data?.gig.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {data?.gig.status}
                </span>
              </div>
              <div className="mt-6">
                <p className="text-indigo-600 font-semibold text-xl">
                  Budget: ₹{data?.gig.budget}
                </p>
              </div>

              <p className="text-gray-600 mt-4">{data?.gig.description}</p>
            </div>

            <div className="w-full lg:w-[40%] flex flex-col gap-6">
              {/* Place Bid Form */}
              {showBidForm && !isClient && data.gig.status != "assigned" && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">Place Your Bid</h2>

                  <div className="flex flex-col gap-3 mb-3">
                    {/* Message */}
                    <div className="flex-1">
                      <textarea
                        placeholder="Your message..."
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        onBlur={(e) => validateBidMessage(e.target.value)}
                        rows={3}
                        className="w-full bg-gray-100 px-3 py-2 rounded-lg outline-none resize-none"
                      />

                      {bidMessageError && (
                        <p className="text-red-500 text-sm mt-3">
                          {bidMessageError}
                        </p>
                      )}
                    </div>

                    {/* Budget */}
                    <div className="w-full">
                      <div className="flex items-center bg-gray-100 rounded-lg px-3">
                        <span className="text-gray-500 font-medium">₹</span>
                        <input
                          type="text"
                          placeholder="Amount"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          onBlur={(e) => validateBidAmount(e.target.value)}
                          className="w-full bg-transparent px-2 py-2 outline-none"
                        />
                      </div>
                      {bidAmountError && (
                        <p className="text-red-500 text-sm mt-3 mb-3">
                          {bidAmountError}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceBid}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition w-full"
                  >
                    Place Bid
                  </button>
                </div>
              )}

              {/* Bids Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Bids</h2>

                {data?.bids.length === 0 ? (
                  <p className="text-gray-400">No bids yet.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {data?.bids.map((bid) => (
                      <div
                        key={bid._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-indigo-600">
                            ₹ {bid.bidAmount}
                          </p>

                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              bid.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : bid.status === "hired"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {bid.status}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mt-2">
                          {bid.message}
                        </p>

                        {isClient && bid.status === "pending" && (
                          <div className="w-full flex justify-end">
                            <button
                              onClick={() => handleHire(bid._id)}
                              className="mt-3 bg-green-600 text-white px-10 py-1.5 rounded-lg hover:bg-green-700 transition"
                            >
                              Hire
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GigDetails;
