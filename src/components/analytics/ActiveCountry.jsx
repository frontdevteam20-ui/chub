"use client";

import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const ActiveCountry = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState([["Country", "Active Users"]]);
  const [countryListData, setCountryListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "http://localhost:4000/api/analytics/country-active-users";
        if (startDate && endDate) {
          const params = new URLSearchParams({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          });
          url += `?${params.toString()}`;
        }
        console.log('🌍 ActiveCountry API Request:', url);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        // Format for Google GeoChart
        const geoChartData = [["Country", "Active Users"]];
        const listData = [];
        data.forEach(item => {
          geoChartData.push([item.countryName || item.country, item.activeUsers]);
          listData.push({ country: item.countryName || item.country, users: item.activeUsers });
        });

        setChartData(geoChartData);
        setCountryListData(listData);

      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  const maxUsers = countryListData.length > 0 ? Math.max(...countryListData.map(item => item.users)) : 1;

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5 text-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5 text-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-5 mt-5">
      {/* Debug Info */}
      {/* <div className="mb-4 p-2 bg-blue-100 rounded text-xs">
        Debug: loading={loading.toString()}, error={error || 'none'}, chartDataLength={chartData.length}
      </div>
       */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Active Users by Country</h2>
          <p className="text-sm text-gray-500">A clean view of your global user distribution.</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        <div className="w-full md:w-1/2 flex items-center justify-center">
          {chartData.length > 1 ? (
            <Chart
              chartType="GeoChart"
              width="100%"
              height="400px"
              data={chartData}
              options={{
                colorAxis: { colors: ['#fdeee9', '#ef5226'] },
                backgroundColor: '#fff',
                datalessRegionColor: '#e6f6fa',
                defaultColor: '#d1d5db',
                legend: 'none', // Hide the default legend
                tooltip: { textStyle: { fontName: 'Roboto', fontSize: 13 } }
              }}
            />
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
              No data to display on map.
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4 pb-3 mb-4 border-b border-gray-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Country</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Active Users</div>
          </div>
          <div className="space-y-4 h-[350px] overflow-y-auto pr-2">
            {countryListData.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-center">
                <div className="text-sm font-medium text-gray-900">{item.country}</div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 mb-1">{item.users.toLocaleString()}</div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(item.users / maxUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveCountry;
