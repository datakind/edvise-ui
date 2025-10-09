import React from 'react';

export default function InterpretChart() {
  return (
    <div
      className="flex w-fit flex-col items-center rounded-2xl border-2 border-orange-400 bg-white p-4 shadow-md"
      style={{ minWidth: 400 }}
    >
      <div className="mb-6 w-full text-left text-lg font-medium text-black">
        How to interpret chart colors
      </div>
      <div className="flex w-full flex-col items-center">
        {/* Color bar with circles above */}
        <div
          className="relative flex w-full flex-col items-center"
          style={{ minWidth: 340, maxWidth: 500, height: 40 }}
        >
          {/* Color bar */}
          <svg
            width="100%"
            height="20"
            viewBox="0 0 320 20"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              minWidth: 340,
              maxWidth: 500,
            }}
          >
            <defs>
              <linearGradient
                id="bar-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#8ee6ef" />
                <stop offset="100%" stopColor="#00838f" />
              </linearGradient>
            </defs>
            <rect
              x="0"
              y="6"
              width="320"
              height="8"
              rx="4"
              fill="url(#bar-gradient)"
            />
            {/* Center divider */}
            <rect x="159" y="0" width="2" height="20" fill="#cfe6ef" />
          </svg>
          {/* Left circle */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: -10,
              zIndex: 2,
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className="h-5 w-5 rounded-full"
              style={{ background: '#8ee6ef' }}
            />
          </div>
          {/* Right circle */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: -10,
              zIndex: 2,
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className="h-5 w-5 rounded-full"
              style={{ background: '#00838f' }}
            />
          </div>
        </div>
        {/* Arrows and text */}
        <div
          className="mt-2 flex w-full justify-between px-2"
          style={{ minWidth: 340, maxWidth: 500 }}
        >
          {/* Left side */}
          <div className="flex w-1/2 flex-col items-center">
            {/* Left arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#B2F1F9"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
              />
            </svg>

            <div className="px-2 text-center text-base text-gray-500">
              Lighter dots show <b>lower</b> student feature values
            </div>
          </div>
          {/* Right side */}
          <div className="flex w-1/2 flex-col items-center">
            {/* Right arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#007C8C"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>

            <div className="px-2 text-center text-base text-gray-500">
              Darker dots show <b>higher</b> student feature values
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
