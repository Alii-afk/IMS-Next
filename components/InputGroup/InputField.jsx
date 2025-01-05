const InputField = ({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  showIcon = true,
  name,
  register, 
  error,
  defaultValue, 
}) => {
  return (
    <div>
      <label htmlFor={name} className="text-base font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2 grid grid-cols-1 relative">
        <input
          id={name}
          name={name}
          type={type} // Allow dynamic input type, including "datetime-local"
          placeholder={type !== "date" && type !== "datetime-local" ? placeholder : ""} // Remove placeholder for date/time inputs
          className={`block w-full rounded-md bg-white border border-gray-100 py-3 pr-3  ${showIcon ? "pl-10" : "pl-3"} text-base text-gray-900 outline-1 outline-none -outline-offset-1 outline-gray-700  placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm`}
          {...(register ? register(name) : {})} // Register the input if provided (for React Hook Form)
          defaultValue={defaultValue} // Added defaultValue handling
        />
        {showIcon && Icon && (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500 sm:size-4"
          />
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}

    </div>
  );
};

export default InputField;
