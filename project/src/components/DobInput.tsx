import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Calendar, CalendarDays, SlidersHorizontal } from 'lucide-react';
import { parseDateToDdmmyyyy } from '@/lib/dateUtils';

interface DobInputProps {
  value: string; // can be YYYY-MM-DD or DD/MM/YYYY or empty
  onChange: (value: string) => void;
  outputFormat?: 'yyyy-mm-dd' | 'dd/mm/yyyy';
  id?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  language?: string;
}

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

export const DobInput: React.FC<DobInputProps> = ({
  value = '',
  onChange,
  outputFormat = 'yyyy-mm-dd',
  id = 'dob-input',
  className = '',
  placeholder,
  required = false,
  disabled = false,
  language = 'en',
}) => {
  const isHi = language === 'hi';
  const months = isHi ? MONTHS_HI : MONTHS_EN;

  // Toggle between Native iOS/Android Date Picker and 3-Dropdown (Day/Month/Year) mode
  const [mode, setMode] = useState<'native' | 'select'>('native');

  // Internal state for day, month, year
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  // Native input YYYY-MM-DD value
  const [isoValue, setIsoValue] = useState<string>('');

  // Parse incoming value prop into internal states
  useEffect(() => {
    if (!value) {
      setDay('');
      setMonth('');
      setYear('');
      setIsoValue('');
      return;
    }

    let y = '', m = '', d = '';
    if (value.includes('-')) {
      const parts = value.split('-');
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        [y, m, d] = parts;
      } else {
        // DD-MM-YYYY
        [d, m, y] = parts;
      }
    } else if (value.includes('/')) {
      const parts = value.split('/');
      if (parts[2]?.length === 4) {
        // DD/MM/YYYY
        [d, m, y] = parts;
      } else if (parts[0]?.length === 4) {
        // YYYY/MM/DD
        [y, m, d] = parts;
      }
    }

    if (y && m && d) {
      setYear(y);
      setMonth(m.padStart(2, '0'));
      setDay(d.padStart(2, '0'));
      setIsoValue(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
    }
  }, [value]);

  // Handle native input change
  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value; // YYYY-MM-DD
    setIsoValue(raw);
    if (!raw) {
      onChange('');
      return;
    }

    const [y, m, d] = raw.split('-');
    setYear(y);
    setMonth(m);
    setDay(d);

    if (outputFormat === 'dd/mm/yyyy') {
      onChange(`${d}/${m}/${y}`);
    } else {
      onChange(raw);
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (newDay: string, newMonth: string, newYear: string) => {
    setDay(newDay);
    setMonth(newMonth);
    setYear(newYear);

    if (newDay && newMonth && newYear) {
      const y = newYear;
      const m = newMonth.padStart(2, '0');
      const d = newDay.padStart(2, '0');
      const formattedIso = `${y}-${m}-${d}`;
      setIsoValue(formattedIso);

      if (outputFormat === 'dd/mm/yyyy') {
        onChange(`${d}/${m}/${y}`);
      } else {
        onChange(formattedIso);
      }
    } else {
      onChange('');
    }
  };

  // Years options from current year down to 1920
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 105 }, (_, i) => String(currentYear - i));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-medium">
          {mode === 'native'
            ? (isHi ? 'तारीख चुनें (या ड्रॉपडाउन उपयोग करें)' : 'Select Date (or switch to Day/Month/Year)')
            : (isHi ? 'दिन / महीना / साल चुनें' : 'Select Day / Month / Year')}
        </span>
        <button
          type="button"
          onClick={() => setMode(mode === 'native' ? 'select' : 'native')}
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium transition-colors"
        >
          <SlidersHorizontal className="w-3 h-3" />
          {mode === 'native'
            ? (isHi ? 'दिन/महीना/साल रूप में दर्ज करें' : 'Switch to Day/Month/Year')
            : (isHi ? 'कैलेंडर पिकर उपयोग करें' : 'Switch to Calendar')}
        </button>
      </div>

      {mode === 'native' ? (
        <div className="relative flex items-center">
          <input
            id={id}
            type="date"
            max={`${currentYear}-12-31`}
            min="1920-01-01"
            value={isoValue}
            onChange={handleNativeChange}
            required={required}
            disabled={disabled}
            placeholder={placeholder || 'YYYY-MM-DD'}
            style={{ colorScheme: 'dark' }}
            className={`
              w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-lg
              bg-background border border-input text-foreground
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:cursor-not-allowed disabled:opacity-50
              text-sm font-medium tracking-wide
              [color-scheme:dark] appearance-none touch-manipulation
              ${className}
            `}
          />
          <Calendar className="w-4 h-4 text-primary absolute right-3 pointer-events-none" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {/* Day */}
          <div>
            <select
              value={day}
              onChange={(e) => handleDropdownChange(e.target.value, month, year)}
              disabled={disabled}
              className="w-full h-11 min-h-[44px] px-2 rounded-lg bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary"
            >
              <option value="">{isHi ? 'दिन' : 'Day'}</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div>
            <select
              value={month}
              onChange={(e) => handleDropdownChange(day, e.target.value, year)}
              disabled={disabled}
              className="w-full h-11 min-h-[44px] px-2 rounded-lg bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary"
            >
              <option value="">{isHi ? 'महीना' : 'Month'}</option>
              {months.map((m, idx) => {
                const val = String(idx + 1).padStart(2, '0');
                return (
                  <option key={val} value={val}>
                    {m}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Year */}
          <div>
            <select
              value={year}
              onChange={(e) => handleDropdownChange(day, month, e.target.value)}
              disabled={disabled}
              className="w-full h-11 min-h-[44px] px-2 rounded-lg bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary"
            >
              <option value="">{isHi ? 'साल' : 'Year'}</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DobInput;
