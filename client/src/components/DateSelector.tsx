interface DateOption {
  label: string;
}

interface DateSelectorProps {
  dates: DateOption[];
  selectedDate: string;
  onSelect: (dateLabel: string) => void;
}

export default function DateSelector({ dates, selectedDate, onSelect }: DateSelectorProps) {
  return (
    <div className="mt-6">
      <h3 className="text-[18px] font-semibold mb-2 text-[#161616]">Choose date</h3>
      <div className="flex flex-wrap gap-2">
        {dates.map((date) => (
          <button
            key={date.label}
            onClick={() => onSelect(date.label)}
            className={`px-4 py-1.5 text-sm rounded-md border transition ${
              selectedDate === date.label
                ? "bg-[#ffd643] border-yellow-400"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {date.label}
          </button>
        ))}
      </div>
    </div>
  );
}
