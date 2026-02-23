import React, { useState, useRef, useEffect } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DateRangePicker = ({ startDate, endDate, onDateChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    if (!date) return;

    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      // Start new selection
      setTempStartDate(date);
      setTempEndDate(null);
      setIsSelectingEnd(true);
    } else if (isSelectingEnd) {
      // Complete selection
      if (date >= tempStartDate) {
        setTempEndDate(date);
        setIsSelectingEnd(false);
      } else {
        // If end date is before start date, swap them
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
        setIsSelectingEnd(false);
      }
    }
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onDateChange(tempStartDate, tempEndDate);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    setIsSelectingEnd(false);
    onDateChange(null, null);
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <div
        className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-gray-400" />
          <span className="text-sm text-gray-600">
            {tempStartDate && tempEndDate 
              ? `${formatDate(tempStartDate)} - ${formatDate(tempEndDate)}`
              : tempStartDate 
                ? `${formatDate(tempStartDate)} - Select end date`
                : 'Select date range'
            }
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[320px] max-w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              onClick={goToPreviousMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
              aria-label="Previous month"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800">{monthName}</h3>
            <button
              onClick={goToNextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
              aria-label="Next month"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`
                    h-8 flex items-center justify-center text-sm cursor-pointer rounded transition-colors duration-200
                    ${!day ? 'text-gray-300' : ''}
                    ${day && isDateSelected(day) ? 'bg-blue-500 text-white font-semibold' : ''}
                    ${day && isDateInRange(day) && !isDateSelected(day) ? 'bg-blue-100 text-blue-700' : ''}
                    ${day && !isDateSelected(day) && !isDateInRange(day) ? 'hover:bg-gray-100 text-gray-700' : ''}
                  `}
                  onClick={() => handleDateClick(day)}
                  role="button"
                  tabIndex={day ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDateClick(day);
                    }
                  }}
                >
                  {day ? day.getDate() : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <button
              onClick={handleClear}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              disabled={!tempStartDate || !tempEndDate}
              className={`
                px-4 py-2 text-sm font-medium rounded transition-colors duration-200
                ${tempStartDate && tempEndDate
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker; 