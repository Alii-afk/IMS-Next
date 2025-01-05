import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";

export default function InputSearch({ options, label }) {
  const [selected, setSelected] = useState(options[0] || null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter options based on the search term
  const filteredOptions = options.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm/6 font-medium text-gray-900">{label}</label>
      <div className="relative mt-2 border border-gray-500 rounded-md">
        <Listbox value={selected} onChange={setSelected}>
          <Listbox.Button className="w-full cursor-default rounded-md border-gray-300 py-3 pl-3 pr-10  text-sm focus:outline-none ">
            <span className="flex items-center gap-2">
              {selected && selected.avatar && (
                <img
                  alt=""
                  src={selected.avatar}
                  className="h-5 w-5 rounded-full"
                />
              )}
              <span>{selected ? selected.name : "Select an option"}</span>
            </span>
            <ChevronUpDownIcon
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
            />
          </Listbox.Button>
          
          {/* Dropdown */}
          <Listbox.Options
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm"
          >
            {/* Search Input */}
            <div className="px-3 py-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full rounded-md  py-2 pl-3 pr-10 text-sm focus:outline-none border border-black "
              />
            </div>

            {/* List of filtered options */}
            {filteredOptions.map((person) => (
              <Listbox.Option
                key={person.id}
                value={person}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-100"
              >
                <div className="flex items-center">
                  <img
                    alt=""
                    src={person.avatar}
                    className="h-5 w-5 rounded-full mr-2"
                  />
                  <span className="block truncate">{person.name}</span>
                </div>
                {selected?.id === person.id && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                    <CheckIcon className="h-5 w-5" />
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
    </div>
  );
}
