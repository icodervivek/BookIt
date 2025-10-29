import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


interface Experience {
  _id: string;
  experienceName: string;
  experiencePlace: string;
  experiencePrice: number;
  experienceImageURL: string;
}

export default function HomeExperiences(): JSX.Element {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fetch experiences
  const fetchExperiences = async (): Promise<void> => {
    try {
      const res = await axios.get<Experience[]>(`${API_BASE_URL}/experiences`);
      setExperiences(res.data);
      setFilteredExperiences(res.data);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast.error("Failed to load experiences!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSearch = (query: string): void => {
    if (!query.trim()) {
      setFilteredExperiences(experiences);
      return;
    }

    const filtered = experiences.filter((exp) =>
      exp.experienceName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredExperiences(filtered);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <p className="text-gray-600 text-lg mt-20">Loading experiences...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <Navbar onSearch={handleSearch} />

      <div className="min-h-screen py-10 px-6 sm:px-10 lg:px-20">
        <div className="max-w-[1700px] mx-auto">
          {filteredExperiences.length === 0 ? (
            <p className="text-center text-gray-600">
              No experiences found. Add one to get started!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 xl:gap-8">
              {filteredExperiences.map((exp) => (
                <div
                  key={exp._id}
                  className="bg-[#f0f0f0] shadow-sm border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <img
                    src={exp.experienceImageURL}
                    alt={exp.experienceName}
                    className="w-full h-44 object-cover"
                  />

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold truncate">
                        {exp.experienceName}
                      </h3>
                      <span className="text-xs bg-[#d6d6d6] px-2 py-1 rounded-md">
                        {exp.experiencePlace}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      Curated small-group experience. Certified guide. Safety
                      first with gear included.
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm">
                        From{" "}
                        <span className="text-lg font-semibold">
                          ₹{exp.experiencePrice}
                        </span>
                      </p>
                      <button
                        onClick={() => navigate(`/experience/${exp._id}`)}
                        className="bg-[#ffd643] hover:bg-[#f3d155] text-gray-900 text-sm px-4 py-2 rounded transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
