import { useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import DateSelector from "./components/DateSelector";
import TimeSlotSelector from "./components/TimeSlotSelector";
import PriceSummaryCard from "./components/PriceSummaryCard";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


interface Slot {
  time: string;
  totalCount: number;
  bookedCount: number;
}

interface AvailableDate {
  date: string;
  slots: Slot[];
}

interface Experience {
  _id: string;
  experienceName: string;
  experienceDescription: string;
  experienceImageURL: string;
  experienceAbout: string;
  experiencePrice: number;
  availableDates: AvailableDate[];
}

interface DateOption {
  label: string;
  isoDate: string;
}

interface SlotOption {
  time: string;
  left: number;
  soldOut: boolean;
}

export default function ViewExperience(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const dates: DateOption[] =
    experience?.availableDates?.map((d) => ({
      label: new Date(d.date).toDateString(),
      isoDate: new Date(d.date).toLocaleDateString("en-CA"),
    })) || [];

  const selectedDateIso = dates.find((d) => d.label === selectedDateLabel)?.isoDate || "";

  const slots: SlotOption[] =
    experience?.availableDates
      ?.find((d) => new Date(d.date).toDateString() === selectedDateLabel)
      ?.slots?.map((s) => ({
        time: s.time,
        left: s.totalCount - s.bookedCount,
        soldOut: s.bookedCount >= s.totalCount,
      })) || [];

  useEffect(() => {
    const fetchExperience = async (): Promise<void> => {
      try {
        const res = await axios.get<Experience>(
          `${API_BASE_URL}/experiences/${id}`
        );
        setExperience(res.data);
      } catch (err) {
        console.error("Error fetching experience:", err);
      }
    };
    if (id) fetchExperience();
  }, [id]);

  if (!experience) {
    return (
      <p className="text-center mt-20 text-gray-500">Loading...</p>
    );
  }


  return (
    <>
      <Navbar />

      <div className="max-w-[1200px] mx-auto mt-6 px-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-black font-medium hover:underline"
        >
          ← Details
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto mt-10 flex flex-col md:flex-row gap-8 px-6">
        {/* Left: Experience details */}
        <div className="flex-1 rounded-xl">
          <img
            src={experience.experienceImageURL}
            alt={experience.experienceName}
            className="w-[765px] h-[381px] object-cover"
          />
          <h2 className="text-3xl font-bold mt-6 text-[#161616]">
            {experience.experienceName}
          </h2>
          <p className="text-[#6C6C6C] mt-4">
            {experience.experienceDescription}
          </p>

          <DateSelector
            dates={dates}
            selectedDate={selectedDateLabel}
            onSelect={setSelectedDateLabel}
          />

          <TimeSlotSelector
            slots={slots}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />

          <h3 className="text-lg font-semibold mt-6 mb-4">About</h3>
          <div className="bg-[#eeeeee] rounded-lg py-2 mb-20">
            <div className="px-5">
              <p className="text-[12px] text-gray-600">
                {experience.experienceAbout}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Price summary */}
        <div className="flex justify-center md:block">
          <PriceSummaryCard
            experienceId={experience._id}
            experienceName={experience.experienceName}
            selectedDate={selectedDateIso}
            selectedSlot={selectedSlot}
            price={experience.experiencePrice}
            tax={59}
            quantity={quantity}
            setQuantity={setQuantity}
            isActive={!!selectedDateLabel && !!selectedSlot}
            maxQuantity={
              slots.find((s) => s.time === selectedSlot)?.left || 1
            }
          />
        </div>
      </div>
    </>
  );
}
