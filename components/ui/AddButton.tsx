import React from 'react';

const AddButton = ({ onClick }:any) => {
  return (
    <button
      className="border border-black rounded-sm px-5 py-2 ml-5 hover:bg-gray-200 transition duration-300 flex items-center justify-center"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
};

export default AddButton;
