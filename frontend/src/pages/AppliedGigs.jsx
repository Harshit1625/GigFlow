import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

const AppliedGigs = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchAppliedGigs = async () => {
    try {
      const res = await api.get("/api/appliedgigs");
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedGigs();
  }, []);

  const handleGig = (gigId) => {
    if (!gigId) return;
    nav(`/gig/${gigId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="px-10 lg:px-60 py-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800">Applied Gigs</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data && data.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">No posts yet.</p>
          ) : (
            data?.map((gig, index) => (
              <div
                key={index}
                onClick={() => handleGig(gig.gigId)}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3 cursor-pointer hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {gig.title}
                  </h2>

                  <span className="text-sm px-3 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700">
                    {gig.status}
                  </span>
                </div>

                <p className="text-md text-gray-600">{gig.description}</p>

                <div className="mt-auto flex justify-between">
                  <p className="text-indigo-600 font-semibold">₹{gig.budget}</p>
                  <p className="text-gray-400 text-sm">
                    postedBy: {gig.postedBy}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedGigs;
