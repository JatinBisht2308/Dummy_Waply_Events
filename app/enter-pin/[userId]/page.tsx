// pages/pin.tsx
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/assets/logo-waply.png"; // Replace with your logo path

interface PinPageProps {
  params: Promise<{ userId: string }>;
}

const PinPage: React.FC<PinPageProps> = ({ params: paramsPromise }) => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [userId, setUserId] = useState<string | null>(null);

  // Resolve the params Promise and set the userId
  useEffect(() => {
    paramsPromise.then((resolvedParams) => {
      setUserId(resolvedParams.userId);
    });
  }, [paramsPromise]);

  // Handle PIN input
  const handlePinInput = (value: string | number) => {
    const newPin = [...pin];
    const index = newPin.findIndex((digit) => digit === "");

    if (index !== -1 && value !== "clear") {
      newPin[index] = value.toString();
    } else if (value === "clear") {
      const lastFilledIndex = newPin
        .map((digit, idx) => (digit !== "" ? idx : undefined))
        .filter((idx): idx is number => idx !== undefined)
        .pop();

      if (lastFilledIndex !== undefined) {
        newPin[lastFilledIndex] = "";
      }
    }
    setPin(newPin);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return; // Ensure userId is set before proceeding
    const pinCode = pin.join(""); // Convert array to string for submission

    // Send login request to the backend
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, pin: pinCode }),
    });

    if (res.ok) {
      // Redirect to the dashboard or another page on successful login
      router.push('/dashboard');
    } else {
      // Handle error, e.g., display error message
      console.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm">
        {/* Logo */}
        <Image src={logo} alt="Logo" width={50} height={50} className="mx-auto mb-4" />

        {/* Greeting */}
        <h2 className="text-lg font-semibold">Hi, Rwan Adams</h2>
        <p className="text-orange-500 mt-2 mb-6">Verify 4-digit security PIN</p>

        {/* PIN Input Display */}
        <div className="flex justify-center mb-4">
          {pin.map((digit, index) => (
            <div
              key={index}
              className="w-10 h-10 mx-1 border border-gray-400 rounded text-lg flex items-center justify-center"
            >
              {digit}
            </div>
          ))}
        </div>

        <p className="text-orange-500 mb-8 text-sm">Powered By Waply</p>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-4 text-xl">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handlePinInput(num)}
              className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-black"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handlePinInput("clear")}
            className="w-16 h-16 bg-gray-800 text-white rounded-full flex items-center justify-center"
          >
            ⌫
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-orange-500 text-white py-2 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default PinPage;
