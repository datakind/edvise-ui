import React from 'react';

export default function MoreButton({ onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      style={props.style}
      className="flex h-10 w-10 items-center justify-center"
      aria-label="More options"
      aria-haspopup="true"
    >
      <div className="flex space-x-1">
        <div className="h-1 w-1 rounded-full bg-[#1F1F1F]"></div>
        <div className="h-1 w-1 rounded-full bg-[#1F1F1F]"></div>
        <div className="h-1 w-1 rounded-full bg-[#1F1F1F]"></div>
      </div>
    </button>
  );
}
