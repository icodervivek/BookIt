import React from "react";

interface TimeSlot {
  time: string;
  soldOut: boolean;
  left: number;
}

interface TimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedSlot: string;
  onSelect: (time: string) => void;
}

export default function TimeSlotSelector({
  slots,
  selectedSlot,
  onSelect,
}: TimeSlotSelectorProps) {
  return (
    <div className="mt-6">
      <h3 className="text-[18px] font-semibold mb-2 text-[#161616]">
        Choose time
      </h3>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => !slot.soldOut && onSelect(slot.time)}
            className={`px-4 py-1.5 text-sm rounded-md border flex items-center gap-1 transition ${
              slot.soldOut
                ? "bg-[#CCCCCC] text-[#838383] border-gray-200 cursor-not-allowed"
                : selectedSlot === slot.time
                ? "bg-[#ffd643] border-yellow-400"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {slot.time}
            {!slot.soldOut && (
              <span className="text-xs text-red-500 ml-1">{slot.left} left</span>
            )}
            {slot.soldOut && (
              <span className="text-xs text-[#838383] ml-1">Sold out</span>
            )}
          </button>
        ))}
      </div>
      <p className="text-[12px] text-[#838383] mt-2">
        All times are in IST (GMT +5:30)
      </p>
    </div>
  );
}
