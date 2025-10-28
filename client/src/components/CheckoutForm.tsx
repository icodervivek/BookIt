import React, { useState, ChangeEvent } from "react";

interface CheckoutFormProps {
  onApplyPromo: (promoCode: string) => void;
  onChange: (e: ChangeEvent<HTMLInputElement> | { target: { name: string; value: string | boolean } }) => void;
  formData: {
    fullName: string;
    email: string;
    agreedToTerms: boolean;
  };
}

export default function CheckoutForm({ onApplyPromo, onChange, formData }: CheckoutFormProps) {
  const [promoInput, setPromoInput] = useState<string>("");

  const handleApply = () => {
    onApplyPromo(promoInput.trim());
  };

  return (
    <div className="bg-[#efefef] rounded-lg p-6 shadow-sm w-full sm:w-1/2">
      <div className="flex flex-col sm:flex-row gap-4 mb-3">
        <div className="w-full">
          <label className="text-sm text-gray-700">Full name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            className="w-full outline-none bg-[#DDDDDD] mt-1 px-3 py-2 rounded-md"
            placeholder="Your name"
          />
        </div>

        <div className="w-full">
          <label className="text-sm text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="w-full bg-[#DDDDDD] outline-none mt-1 px-3 py-2 rounded-md"
            placeholder="Your email"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Promo code"
          value={promoInput}
          onChange={(e) => setPromoInput(e.target.value)}
          className="bg-[#DDDDDD] outline-none flex-1 px-3 py-2 rounded-md"
        />
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-[#161616] text-white rounded-md"
        >
          Apply
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="accent-black"
          name="agreedToTerms"
          checked={formData.agreedToTerms}
          onChange={(e) =>
            onChange({
              target: {
                name: "agreedToTerms",
                value: e.target.checked,
              },
            })
          }
        />
        <p className="text-sm text-gray-600">
          I agree to the terms and safety policy
        </p>
      </div>
    </div>
  );
}
