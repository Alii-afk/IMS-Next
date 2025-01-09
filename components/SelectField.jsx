import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const SelectField = ({
  label,
  options = [],
  icon: Icon,
  showIcon = true,
  name,
  value,
  error,
  onChange,
  disabled = false,
  register,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);
  
  const registerField = register ? register(name) : {};

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
    if (disabled) return;
    setSelectedOption(option);
    setIsOpen(false);
    
    if (onChange) {
      onChange({ target: { name, value: option.value } });
    }
    
    if (registerField.onChange) {
      registerField.onChange({
        target: { name, value: option.value },
        type: 'change'
      });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-base font-medium text-gray-900 flex items-center mb-1">
        {label}
      </label>

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`cursor-pointer relative w-full bg-white border border-gray-500 rounded-lg py-3 px-4 flex items-center justify-between hover:border-gray-300 ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      >
        {showIcon && Icon && (
          <Icon className="w-5 h-5 text-gray-400 absolute left-3" />
        )}

        <span className={`${showIcon ? "ml-7" : ""} text-gray-700`}>
          {selectedOption ? selectedOption.label : "Select an option"}
        </span>

        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-auto">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className={`px-4 py-3 cursor-pointer flex items-center space-x-2 hover:bg-blue-50 transition-colors duration-150 ${
                selectedOption?.value === option.value ? "bg-blue-50" : ""
              }`}
            >
              {option.icon && (
                <span className="text-gray-400">{option.icon}</span>
              )}
              <span className="text-gray-700 hover:text-blue-600">
                {option.label}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Hidden input for React Hook Form */}
      <input
        type="hidden"
        name={name}
        value={selectedOption?.value || ''}
        {...registerField}
      />
      
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SelectField;