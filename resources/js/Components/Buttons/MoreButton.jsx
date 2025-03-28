import React from 'react';

export default function MoreButton({ onClick, ...props}) {
    return (
      <button
        onClick={onClick}
        style={props.style}
        className="w-10 h-10 flex items-center justify-center"
        aria-label="More options"
        aria-haspopup="true"
      >
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-[#1F1F1F] rounded-full"></div>
          <div className="w-1 h-1 bg-[#1F1F1F] rounded-full"></div>
          <div className="w-1 h-1 bg-[#1F1F1F] rounded-full"></div>
        </div>
      </button>
    );
  }
  
