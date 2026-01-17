'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  labels: {
    heading: string;
    eventName: string;
    eventDate: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    eventPassed: string;
    setEvent: string;
    save: string;
    cancel: string;
  };
}

export default function CountdownTimer({ labels }: CountdownTimerProps) {
  const [eventName, setEventName] = useState('Graduation Day 🎓');
  const [targetDate, setTargetDate] = useState<Date | null>(new Date('2026-07-01'));
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [tempEventName, setTempEventName] = useState('');
  const [tempDate, setTempDate] = useState('');

  // Load from localStorage after mount
  useEffect(() => {
    const savedEventName = localStorage.getItem('countdownEventName');
    const savedDate = localStorage.getItem('countdownTargetDate');
    
    const timer = setTimeout(() => {
      if (savedEventName) setEventName(savedEventName);
      if (savedDate) setTargetDate(new Date(savedDate));
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate time left
  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const handleSave = () => {
    if (!tempDate || !tempEventName.trim()) return;

    const newDate = new Date(tempDate);
    setTargetDate(newDate);
    setEventName(tempEventName.trim());

    localStorage.setItem('countdownEventName', tempEventName.trim());
    localStorage.setItem('countdownTargetDate', newDate.toISOString());

    setIsEditing(false);
    setTempDate('');
    setTempEventName('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempDate('');
    setTempEventName('');
  };

  const handleEdit = () => {
    setTempEventName(eventName);
    if (targetDate) {
      // Format date for input[type="datetime-local"]
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      const hours = String(targetDate.getHours()).padStart(2, '0');
      const minutes = String(targetDate.getMinutes()).padStart(2, '0');
      setTempDate(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
    setIsEditing(true);
  };

  const isPassed = targetDate && new Date() > targetDate;

  return (
    <div className="space-y-4">
      {isEditing ? (
        // Edit Mode
        <div className="space-y-3">
          <div>
            <label className="block text-[9px] font-bold mb-1">{labels.eventName}:</label>
            <input
              type="text"
              value={tempEventName}
              onChange={(e) => setTempEventName(e.target.value)}
              placeholder="e.g., Birthday 🎂"
              className="w-full px-2 py-2 text-[10px] border-2 border-black bg-white font-bold"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold mb-1">{labels.eventDate}:</label>
            <input
              type="datetime-local"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              className="w-full px-2 py-2 text-[10px] border-2 border-black bg-white font-bold"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!tempDate || !tempEventName.trim()}
              className="flex-1 px-3 py-2 bg-pastel-mint border-2 border-black font-bold text-[9px] hover:bg-opacity-80 disabled:opacity-50"
            >
              {labels.save}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-3 py-2 bg-pastel-pink border-2 border-black font-bold text-[9px] hover:bg-opacity-80"
            >
              {labels.cancel}
            </button>
          </div>
        </div>
      ) : (
        // Display Mode
        <>
          {/* Event Name */}
          <div className="text-center">
            <h3 className="font-press text-sm sm:text-base mb-2 text-retro-border wrap-break-word">
              {eventName}
            </h3>
            <button
              onClick={handleEdit}
              className="text-[8px] px-2 py-1 bg-pastel-yellow border-2 border-black font-bold hover:bg-opacity-80"
            >
              ⚙️ {labels.setEvent}
            </button>
          </div>

          {/* Countdown Display */}
          {isPassed ? (
            <div className="text-center py-6">
              <p className="text-sm font-bold text-pastel-purple animate-pulse">
                🎉 {labels.eventPassed} 🎉
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {/* Days */}
              <div className="bg-pastel-mint border-2 border-black p-2 text-center overflow-hidden">
                <div className={`font-press text-retro-border ${
                  timeLeft.days >= 1000 ? 'text-xs sm:text-sm' :
                  timeLeft.days >= 100 ? 'text-sm sm:text-base' :
                  'text-lg sm:text-2xl'
                }`}>
                  {timeLeft.days}
                </div>
                <div className="text-[8px] sm:text-[9px] font-bold mt-1">{labels.days}</div>
              </div>

              {/* Hours */}
              <div className="bg-pastel-yellow border-2 border-black p-2 text-center overflow-hidden">
                <div className={`font-press text-retro-border ${
                  timeLeft.hours >= 100 ? 'text-sm sm:text-base' :
                  'text-lg sm:text-2xl'
                }`}>
                  {timeLeft.hours}
                </div>
                <div className="text-[8px] sm:text-[9px] font-bold mt-1">{labels.hours}</div>
              </div>

              {/* Minutes */}
              <div className="bg-pastel-purple border-2 border-black p-2 text-center overflow-hidden">
                <div className={`font-press text-white ${
                  timeLeft.minutes >= 100 ? 'text-sm sm:text-base' :
                  'text-lg sm:text-2xl'
                }`}>
                  {timeLeft.minutes}
                </div>
                <div className="text-[8px] sm:text-[9px] font-bold text-white mt-1">
                  {labels.minutes}
                </div>
              </div>

              {/* Seconds */}
              <div className="bg-pastel-pink border-2 border-black p-2 text-center overflow-hidden">
                <div className={`font-press text-retro-border ${
                  timeLeft.seconds >= 100 ? 'text-sm sm:text-base' :
                  'text-lg sm:text-2xl'
                }`}>
                  {timeLeft.seconds}
                </div>
                <div className="text-[8px] sm:text-[9px] font-bold mt-1">{labels.seconds}</div>
              </div>
            </div>
          )}

          {/* Pixel Art Decoration */}
          <div className="flex justify-center gap-1">
            <div className="w-3 h-3 bg-pastel-mint border border-black animate-pulse" />
            <div className="w-3 h-3 bg-pastel-yellow border border-black animate-pulse delay-75" />
            <div className="w-3 h-3 bg-pastel-purple border border-black animate-pulse delay-150" />
            <div className="w-3 h-3 bg-pastel-pink border border-black animate-pulse delay-200" />
          </div>
        </>
      )}
    </div>
  );
}
