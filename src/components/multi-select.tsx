import React, { useState } from "react";
import Button from "./button";
import Popover from "./popover";
import { formatSnakeCase } from "@/lib/utils";
import Image from "next/image";

const MultiSelect = ({
  selected,
  setSelected,
  darkMode = false,
  queries,
  placeholder = "Search",
  ...props
}) => {
  const handleOnClick = (query) => {
    if (selected.includes(query)) {
      setSelected(selected.filter((item) => item !== query));
    } else {
      setSelected([...selected, query]);
    }
  };

  const formattedButtonText = selected.length
    ? selected.map(formatSnakeCase).join(", ")
    : placeholder;

  return (
    <Popover>
        <Button
          variant="outline"
          imageSrc="/images/dropdown-arrow.svg"
          text={formattedButtonText}
        />
        <div className="flex flex-col gap-1 bg-white border p-1 w-full rounded-lg">
          {queries
            .sort((a, b) => a.localeCompare(b))
            .map((query, index) => (
              <div
                className="flex items-center gap-3 p-1 px-2 rounded-md hover:bg-neutral-200 cursor-pointer"
                onClick={() => handleOnClick(query)}
                key={index}
              >
                <p
                  className={`font-semibold ${
                    selected.includes(query)
                      ? "text-green-600"
                      : "text-neutral-500"
                  }`}
                >
                  {formatSnakeCase(query)}
                </p>
                {selected.includes(query) && (
                  <h6 className="text-green-600">Selected</h6>
                )}
              </div>
            ))}
        </div>
    </Popover>
  );
};

export default MultiSelect;