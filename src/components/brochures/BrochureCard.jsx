import React from "react";
import { FaFileAlt, FaUser, FaIndustry, FaEnvelope, FaCalendarAlt, FaPhoneAlt, FaDownload } from 'react-icons/fa';

const BrochureCard = ({ brochure, formatDateTime }) => (
  <div
    className="relative bg-gradient-to-br from-white via-gray-50 to-teal-50 border border-gray-100 rounded-2xl shadow-md p-6 flex flex-col gap-3 hover:shadow-xl transition-all duration-200 group"
  >
    {/* Industry Badge */}
    <div className="absolute top-3 right-3">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
        <FaIndustry className="w-3 h-3" />
        {brochure.industry}
      </div>
    </div>

    <div className="flex items-center gap-3 mb-2 pr-20">
      <FaFileAlt className="text-cyan-500 w-7 h-7" />
      <span className="font-bold text-xl text-gray-800 truncate group-hover:text-teal-600 transition-colors">
        {brochure.brochureTitle}
      </span>
    </div>
    
    <div className="flex flex-wrap gap-2 text-gray-700 text-sm">
      <span className="flex items-center gap-1 bg-teal-100 rounded px-2 py-1">
        <FaUser className="text-emerald-400" /> 
        {brochure.firstName}
      </span>
      <span className="flex items-center gap-1 bg-blue-100 rounded px-2 py-1">
        <FaEnvelope className="text-blue-400" /> 
        {brochure.email}
      </span>
      <span className="flex items-center gap-1 bg-orange-100 rounded px-2 py-1">
        <FaPhoneAlt className="text-orange-400" /> 
        {brochure.phoneNumber}
      </span>
    </div>
    
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex items-center text-gray-600">
        <span className="font-bold mr-1" style={{fontSize: '12px'}}>Company:</span> 
        <span className="text-gray-800 text-left" style={{fontSize: '12px'}}>{brochure.companyName}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <span className="font-bold mr-1" style={{fontSize: '12px'}}>Source:</span> 
        <span className="text-gray-800 text-left" style={{fontSize: '12px'}}>{brochure.source}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <span className="font-bold mr-1" style={{fontSize: '12px'}}>Message:</span> 
        <span className="text-gray-800 line-clamp-2 text-left" style={{fontSize: '12px'}}>{brochure.message}</span>
      </div>
    </div>
    
    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
      <div className="flex items-center gap-2">
        <FaCalendarAlt className="text-gray-400" />
        <span>Submitted: {formatDateTime(brochure.submittedAt)}</span>
      </div>
     
    </div>
    <div className="flex items-center gap-1 text-teal-600 font-medium">
        <FaDownload className="w-3 h-3" />
        <span>Downloaded</span>
      </div>
  </div>
);

export default BrochureCard; 