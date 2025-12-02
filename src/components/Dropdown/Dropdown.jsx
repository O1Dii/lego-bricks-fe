import React, { useState } from "react";

const Dropdown = ({options, selected, setSelected}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown">
      <button
        className="dropdown__button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selected}</span>
        <svg
          className={`dropdown__icon ${isOpen ? "rotated" : ""}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown__menu">
          {options.map((option) => (
            <div
              key={option}
              className={`dropdown__item ${
                option === selected ? "selected" : ""
              }`}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
