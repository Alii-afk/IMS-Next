import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { CiCalendarDate } from "react-icons/ci";

const SelectField = ({
  label,
  options = [],
  icon: Icon,
  showIcon = true,
  name,
  value,
  error,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  
  useEffect(() => {
    if (value) {
      const selected = options.find((option) => option.value === value);
      setSelectedOption(selected || null);
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange({ target: { name, value: option.value } });
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Label */}
        <label className="text-base font-medium text-gray-900 flex items-center mb-1">
          {label}
        </label>

        {/* Custom Select Button */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer relative w-full bg-white border border-gray-500 rounded-lg py-3 px-4 flex items-center justify-between hover:border-gray-300"
        >
          {/* Icon */}
          {showIcon && Icon && (
            <Icon className="w-5 h-5 text-gray-400 absolute left-3" />
          )}

          {/* Selected Value */}
          <span className={`${showIcon ? "ml-7" : ""} text-gray-700`}>
            {selectedOption ? selectedOption.label : "Select an option"}
          </span>

          {/* Dropdown Arrow */}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1  bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-auto">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`
                px-4 py-3 cursor-pointer flex items-center space-x-2
                hover:bg-blue-50 transition-colors duration-150
                ${selectedOption?.value === option.value ? "bg-blue-50" : ""}
              `}
              >
                {/* Option Icon (if any) */}
                {option.icon && (
                  <span className="text-gray-400">{option.icon}</span>
                )}

                {/* Option Label */}
                <span className="text-gray-700 hover:text-blue-600">
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        )}
      {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </>
  );
};

export default SelectField;
