"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../../public/assets/logo-waply.png";
import { FaAngleDown } from "react-icons/fa";
import { Key } from "react";

type Props = {
  params: Promise<{ id: string }>;
  name: string;
};

const Page = ({ params, name }: Props) => {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [showCustomRecurring, setShowCustomRecurring] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    recurring: "",
    customRecurring: "",
    participants: "",
  });

  useEffect(() => {
    params.then((resolvedParams) => setUnwrappedParams(resolvedParams));
  }, [params]);

  const [dateRange, setDateRange] = useState(getCurrentWeekRange());
  const [selectedValue, setSelectedValue] = useState("Today");

  function getCurrentWeekRange() {
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const lastDayOfWeek = new Date(today.setDate(firstDayOfWeek.getDate() + 6));
    return {
      start: firstDayOfWeek.toLocaleDateString(),
      end: lastDayOfWeek.toLocaleDateString(),
    };
  }

  function getCurrentMonthRange() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    return {
      start: firstDayOfMonth.toLocaleDateString(),
      end: lastDayOfMonth.toLocaleDateString(),
    };
  }

  const handleDateRangeChange = (key: Key) => {
    const selectedKey = key as string;
    if (selectedKey === "this-week") {
      setDateRange(getCurrentWeekRange());
      setSelectedValue("This Week");
    } else if (selectedKey === "this-month") {
      setDateRange(getCurrentMonthRange());
      setSelectedValue("This Month");
    } else {
      setSelectedValue("Today");
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setShowActionButtons(false);
    setShowCustomRecurring(false);
    setFormData({
      title: "",
      date: "",
      time: "",
      recurring: "",
      customRecurring: "",
      participants: "",
    });
  };

  const handleRecurringChange = (event) => {
    const value = event.target.value;
    setFormData({ ...formData, recurring: value });
    setShowCustomRecurring(value === "Custom");
  };

  const handleInputFocus = () => {
    setShowActionButtons(true);
  };

  if (!unwrappedParams) {
    return <p>Loading...</p>;
  }

  const { id } = unwrappedParams;

  return (
    <div className="bg-[rgba(255, 255, 255, 1)] w-screen h-screen">
      {/* ----------- NAVBAR ------------- */}
      <div className="navbar-events w-full flex items-center justify-start p-4 relative">
        <Image src={logo} alt="Waply Logo" className="absolute" />
        <div className="flex items-center w-full justify-center">
          <h2 className="text-[#3A3A3A] font-semibold text-[24px]">
            Scheduled Events
          </h2>
        </div>
      </div>

      {/* ------------ DISPLAY DATE RANGE AND DROP DOWN ------------- */}
      <div className="p-4 flex justify-between">
        <div className="flex items-center">
          <p>
            {dateRange.start} - {dateRange.end}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <button
              className="border-[#FF880080] border-[1px] flex py-1 px-3 text-[15px]"
              onClick={() => handleDateRangeChange("this-week")}
            >
              {selectedValue}
              <FaAngleDown className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      <p>User ID: {id}</p>
      <p>{name}</p>

      {/* Button to open the Edit Event Modal */}
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Edit Event
      </button>

      {/* Modal for editing the event */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Edit Event</h3>
              <button
                onClick={handleModalClose}
                className="text-gray-500 text-xl"
              >
                &times;
              </button>
            </div>
            <div className="mt-4">
              <label className="block font-medium text-gray-700">
                Reminder/Meeting Title
              </label>
              <input
                type="text"
                placeholder="Dinner with Tom"
                className="w-full p-2 mt-1 border rounded"
                value={formData.title}
                onFocus={handleInputFocus}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="mt-4">
              <label className="block font-medium text-gray-700">
                Starting Date
              </label>
              <input
                type="date"
                className="w-full p-2 mt-1 border rounded"
                value={formData.date}
                onFocus={handleInputFocus}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="mt-4">
              <label className="block font-medium text-gray-700">Time</label>
              <input
                type="time"
                className="w-full p-2 mt-1 border rounded"
                value={formData.time}
                onFocus={handleInputFocus}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
            <div className="mt-4">
              <label className="block font-medium text-gray-700">Recurring</label>
              <select
                className="w-full p-2 mt-1 border rounded"
                value={formData.recurring}
                onFocus={handleInputFocus}
                onChange={handleRecurringChange}
              >
                <option value="">Select</option>
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            {showCustomRecurring && (
              <div className="mt-4">
                <label className="block font-medium text-gray-700">
                  Custom Frequency
                </label>
                <input
                  type="text"
                  placeholder="e.g., Every Two Days"
                  className="w-full p-2 mt-1 border rounded"
                  value={formData.customRecurring}
                  onFocus={handleInputFocus}
                  onChange={(e) =>
                    setFormData({ ...formData, customRecurring: e.target.value })
                  }
                />
              </div>
            )}
            <div className="mt-4">
              <label className="block font-medium text-gray-700">Invites</label>
              <input
                type="text"
                placeholder="shishir@as.com"
                className="w-full p-2 mt-1 border rounded"
                value={formData.participants}
                onFocus={handleInputFocus}
                onChange={(e) =>
                  setFormData({ ...formData, participants: e.target.value })
                }
              />
            </div>

            {/* Conditional Buttons */}
            {showActionButtons ? (
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => alert("Event Deleted")}
                  className="w-1/2 bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => alert("Event Updated")}
                  className="w-1/2 bg-[#FF9800] text-white px-4 py-2 rounded ml-2"
                >
                  Update
                </button>
              </div>
            ) : (
              <button
                onClick={() => alert("Event Deleted")}
                className="w-full border-2 border-[#FF9800] text-[#FF9800] px-4 py-2 rounded mt-6"
              >
                Delete Event
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
