import React, { useState, useRef, useEffect } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DateRangePicker = ({ startDate, endDate, onDateChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Calculate date limits - only allow last 6 months
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setFullYear(today.getFullYear() - 10);
  const minDate = sixMonthsAgo;
  const maxDate = today;
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset temp dates if picker is closed without applying
        if (tempStartDate !== startDate || tempEndDate !== endDate) {
          setTempStartDate(startDate);
          setTempEndDate(endDate);
          setIsSelectingEnd(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [tempStartDate, tempEndDate, startDate, endDate]);

  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  // Set current month to start date when it changes
  useEffect(() => {
    if (startDate) {
      setCurrentMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
    }
  }, [startDate]);

  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateInRange = (date) => {
    if (!tempStartDate || !tempEndDate) return false;
    const start = new Date(tempStartDate);
    const end = new Date(tempEndDate);
    const checkDate = new Date(date);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    checkDate.setHours(12, 0, 0, 0);
    return checkDate >= start && checkDate <= end;
  };

  const isDateSelected = (date) => {
    if (!date) return false;
    const checkDate = new Date(date);
    checkDate.setHours(12, 0, 0, 0);
    
    if (tempStartDate) {
      const start = new Date(tempStartDate);
      start.setHours(12, 0, 0, 0);
      if (checkDate.getTime() === start.getTime()) return true;
    }
    
    if (tempEndDate) {
      const end = new Date(tempEndDate);
      end.setHours(12, 0, 0, 0);
      if (checkDate.getTime() === end.getTime()) return true;
    }
    
    return false;
  };

  const handleDateClick = (date) => {
    // Check if date is within allowed range (last 6 months)
    if (date < minDate || date > maxDate) {
      return; // Don't allow selection outside range
    }
    
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(date);
      setTempEndDate(null);
    } else {
      if (date < tempStartDate) {
        setTempStartDate(date);
        setTempEndDate(null);
      } else {
        setTempEndDate(date);
      }
    }
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onDateChange({ startDate: tempStartDate, endDate: tempEndDate });
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    onDateChange({ startDate: null, endDate: null });
    setIsOpen(false);
  };

    const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setCurrentMonth(new Date(newYear, currentMonth.getMonth(), 1));
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setCurrentMonth(new Date(currentMonth.getFullYear(), newMonth, 1));
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

    const handlePresetClick = (preset) => {
    const today = new Date();
    let newStartDate, newEndDate;

    switch (preset) {
      case 'today':
        newStartDate = today;
        newEndDate = today;
        break;
      case 'yesterday':
        newStartDate = new Date(today.setDate(today.getDate() - 1));
        newEndDate = newStartDate;
        break;
      case 'last_7_days':
        newEndDate = new Date();
        newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - 6);
        break;
      case 'last_30_days':
        newEndDate = new Date();
        newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - 29);
        break;
      case 'this_month':
        newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        newEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'last_month':
        newStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        newEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        return;
    }

    onDateChange({ startDate: newStartDate, endDate: newEndDate });
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (!startDate && !endDate) return 'Select date range';
    if (startDate && !endDate) return formatDate(startDate);
    if (!startDate && endDate) return formatDate(endDate);
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return 'Select date range';
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm border border-transparent rounded-lg bg-gradient-to-r from-[#ef5226] to-[#f57c51] hover:from-[#e04b21] hover:to-[#ef6e46] focus:outline-none focus:ring-2 focus:ring-[#ef5226] focus:ring-opacity-50 transition-colors duration-200"
      >
        <span className="flex items-center">
          <FaCalendarAlt className="mr-2 text-white" />
          <span className="text-white font-medium">{getDisplayText()}</span>
        </span>
      </button>

      {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 flex p-4 min-w-[400px] ">
          <div className="flex flex-col pr-4 border-r border-gray-200 space-y-2">
            <button onClick={() => handlePresetClick('today')} className="text-left text-sm text-gray-700 hover:bg-gray-100 p-1 rounded w-full">Today</button>
            <button onClick={() => handlePresetClick('yesterday')} className="text-left text-sm text-gray-700 hover:bg-gray-100 p-1 rounded w-full">Yesterday</button>
            <button onClick={() => handlePresetClick('last_7_days')} className="text-left text-sm text-gray-700 hover:bg-gray-100 p-1 rounded w-full">Last 7 Days</button>
            <button onClick={() => handlePresetClick('last_30_days')} className="text-left text-sm text-gray-700 hover:bg-gray-100 p-1 rounded w-full">Last 30 Days</button>
            <button onClick={() => handlePresetClick('this_month')} className="text-left text-sm text-gray-700 hover:bg-gray-100 p-1 rounded w-full">This Month</button>
            <button onClick={() => handlePresetClick('last_month')} className="text-left text-sm text-gray-700 hover:bg-gray-100 p-1 rounded w-full">Last Month</button>
          </div>
          <div className="pl-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
                        <div className="flex items-center space-x-2">
              <select 
                value={currentMonth.getMonth()} 
                onChange={handleMonthChange} 
                className="border-gray-300 rounded-md shadow-sm text-sm font-semibold text-gray-800 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
              <select 
                value={currentMonth.getFullYear()} 
                onChange={handleYearChange} 
                className="border-gray-300 rounded-md shadow-sm text-sm font-semibold text-gray-800 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                {[...Array(10)].map((_, i) => {
                  const y = new Date().getFullYear() - i;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
            </div>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 mb-4">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <button
                key={index}
                onClick={() => date && handleDateClick(date)}
                disabled={!date}
                className={`
                  w-8 h-8 flex items-center justify-center text-sm rounded-md transition-colors
                  ${date < minDate || date > maxDate ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                  ${date && date.toDateString() === new Date().toDateString() ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                  ${date && isDateInRange(date) ? 'bg-blue-500 text-white' : ''}
                  ${date && (isDateSelected(date)) ? 'bg-blue-600 text-white font-semibold' : ''}
                  ${date && !date.toDateString() === new Date().toDateString() && !isDateInRange(date) && !isDateSelected(date) ? 'hover:bg-gray-100' : ''}
                    : ''
                  }
                `}
              >
                {date ? date.getDate() : ''}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
                    <div className="flex justify-between pt-4">
            <button
              onClick={handleClear}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
            <div className="space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!tempStartDate || !tempEndDate}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
                      </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
