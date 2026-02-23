import React, { useState } from "react";
import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import ActiveCountry from "./ActiveCountry";
import ScreenAnalytics from "./ScreenAnalytics";
import DateRangePicker from "./DateRangePicker";

export default function GeoView({ handleLogout }) {
  // Date range state (lifted up for child components)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Handler for date range picker
  const handleDateChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:ml-64">
      <Navbar handleLogout={handleLogout} />
      <div className="flex flex-1 w-full pt-15">
        {/* Sidebar / Hamburger */}
        <div className="sm:block">
          <HamburgerMenu handleLogout={handleLogout} />
        </div>

        {/* Main Content: stack analytics and country vertically */}
        <div className="flex-1 max-w-7xl mx-auto p-4 flex flex-col items-center justify-center">
          {/* Title + Filter Bar */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 mt-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">  Traffic Acquisition</h1>
            <div className="flex items-center">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateChange}
                className="ml-4"
              />
            </div>
          </div>

          {/* Analytics and Country: stacked as col-12, col-12 */}
          <ScreenAnalytics startDate={startDate} endDate={endDate} />
          <ActiveCountry startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </div>
  );
}


