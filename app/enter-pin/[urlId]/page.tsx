"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import axios from "axios"; // Import Axios
import logo from "../../../public/assets/logo-waply.png";

interface PinPageProps {
  params: Promise<{ urlId: string }>;
}

const PinPage: React.FC<PinPageProps> = ({ params: paramsPromise }) => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [urlId, setUrlId] = useState<string | null>(null);

  useEffect(() => {
    paramsPromise.then((resolvedParams) => {
      setUrlId(resolvedParams.urlId);
    });
  }, [paramsPromise]);

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

    if (newPin.join("").length === 4) {
      verifyPin(newPin.join(""));
    }
  };

  const verifyPin = async (pinCode: string) => {
    if (!urlId) return;
    try {
      const res = await axios.post(
        "http://dev.waply.co/api/v1/auth/login",
        { urlId, pin: pinCode },
        { withCredentials: true } // Send cookies with the request
      );

      if (res.status === 200) {
        router.push(`/events/${urlId}`); // Redirect to events page with urlId
      } else {
        console.error("Login failed");
        setPin(["", "", "", ""]); // Clear the PIN if verification fails
      }
    } catch (error) {
      console.error("Error verifying PIN:", error);
      setPin(["", "", "", ""]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full h-screen md:h-auto md:w-auto md:max-w-sm"
      >
        <Image
          src={logo}
          alt="Logo"
          width={50}
          height={50}
          className="mx-auto mb-4"
        />

        <h2 className="text-lg font-semibold">Hi, Rwan Adams</h2>
        <p className="text-orange-500 mt-2 mb-6">Verify 4-digit security PIN</p>

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

        <div className="grid grid-cols-3 gap-4 text-xl">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((num) => (
            <Button
              key={num}
              type="button"
              onClick={() => handlePinInput(num)}
              className="w-16 h-16 bg-gray-100 text-black rounded-full flex items-center justify-center text-xl hover:bg-gray-200"
            >
              {num}
            </Button>
          ))}
          <Button
            type="button"
            onClick={() => handlePinInput("clear")}
            className="w-16 h-16 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl hover:bg-gray-900"
          >
            ⌫
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PinPage;
