import React, { useState } from "react";
import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import { getStartOfWeek, formatDateTime } from '../leads/utils';
import useBrochures from './useBrochures';
import BrochureDashboardCards from './BrochureDashboardCards';
import BrochureCard from './BrochureCard';
import Pagination from './Pagination';

const Brochures = ({ handleLogout }) => {
  const { brochures, loading, industryStats, sortedIndustries, uniqueIndustries } = useBrochures();
  console.log('📊 Brochures component received data:', { brochures: brochures.length, loading, industryStats, sortedIndustries: sortedIndustries.length, uniqueIndustries: uniqueIndustries.length });
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
  const [selectedIndustry, setSelectedIndustry] = useState("all"); // "all" or specific industry
  const [page, setPage] = useState(1);
  const pageSize = 6; // Show 6 cards per page

  // Dashboard stats
  const totalBrochures = brochures.length;
  const startOfWeek = getStartOfWeek();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const brochuresToday = brochures.filter(b => b.submittedAt && b.submittedAt >= today).length;
  const brochuresThisMonth = brochures.filter(b => b.submittedAt && b.submittedAt >= startOfMonth).length;
  const newBrochuresThisWeek = brochures.filter(b => b.submittedAt && b.submittedAt >= startOfWeek).length;

  // Filter brochures by selected industry
  let filteredBrochures = brochures;
  if (selectedIndustry !== "all") {
    filteredBrochures = brochures.filter(b => b.industry === selectedIndustry);
  }

  // Filtered and sorted brochures based on sortOrder
  let displayedBrochures = [];
  if (sortOrder === "newest") {
    // Show filtered brochures, sorted by newest
    displayedBrochures = [...filteredBrochures]
      .filter(b => b.submittedAt)
      .sort((a, b) => b.submittedAt - a.submittedAt);
  } else {
    // Show filtered brochures, sorted by oldest
    displayedBrochures = [...filteredBrochures]
      .filter(b => b.submittedAt)
      .sort((a, b) => a.submittedAt - b.submittedAt);
  }

  const totalPages = Math.ceil(displayedBrochures.length / pageSize);
  const paginatedBrochures = displayedBrochures.slice((page - 1) * pageSize, page * pageSize);

  // Reset page to 1 when sortOrder or selectedIndustry changes
  React.useEffect(() => {
    setPage(1);
  }, [sortOrder, selectedIndustry]);

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:ml-64">
      <Navbar handleLogout={handleLogout} />
      <div className="flex flex-1 w-full pt-15">
        <div className="sm:block">
          <HamburgerMenu handleLogout={handleLogout} />
        </div>
        <div className="flex-1 max-w-6xl mx-auto p-4 mt-3">
          <h1 className="text-2xl font-bold mb-4">Industry Brochures</h1>
          {/* Dashboard Cards */}
          <BrochureDashboardCards
            totalBrochures={totalBrochures}
            newBrochuresThisWeek={newBrochuresThisWeek}
            brochuresToday={brochuresToday}
            brochuresThisMonth={brochuresThisMonth}
            loading={loading}
            industryStats={industryStats}
            sortedIndustries={sortedIndustries}
          />
          
          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters & Industry Analysis</h2>
            
            {/* Industry Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Industry:</label>
                <select
                  value={selectedIndustry}
                  onChange={e => setSelectedIndustry(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {uniqueIndustries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry === "all" ? "All Industries" : industry}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by:</label>
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Industry Statistics */}
            {sortedIndustries.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold mb-3 text-gray-700">Industry Download Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sortedIndustries.slice(0, 6).map((industry, index) => (
                    <div key={industry} className="bg-gray-50 rounded-lg p-3 border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800 truncate">{industry}</span>
                        <span className="text-sm font-bold text-teal-600">{industryStats[industry]}</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(industryStats[industry] / Math.max(...Object.values(industryStats))) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Brochures List - Card-based, beautiful UI */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {selectedIndustry === "all" ? "All Brochures" : `${selectedIndustry} Brochures`}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({displayedBrochures.length} {displayedBrochures.length === 1 ? 'brochure' : 'brochures'})
              </span>
            </h2>
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading brochures...</div>
            ) : displayedBrochures.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {selectedIndustry === "all" ? "No brochures found." : `No brochures found for ${selectedIndustry}.`}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBrochures.map(brochure => (
                  <BrochureCard key={brochure.id} brochure={brochure} formatDateTime={formatDateTime} />
                ))}
              </div>
            )}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={pageSize}
              totalItems={displayedBrochures.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brochures;
