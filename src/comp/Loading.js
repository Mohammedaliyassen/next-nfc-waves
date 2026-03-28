import React from 'react';

const Loading = () => {
  return (
    <>
      <div className="loading-container">
        <svg className="nfc-loader-icon" viewBox="0 0 100 100">
          {/* Base NFC Symbol */}
          <g transform="translate(15, 15) scale(0.7)">
            <path className="wave" d="M25,50 A25,25 0 0 1 75,50" />
            <path className="wave wave-2" d="M35,50 A15,15 0 0 1 65,50" />
            <path className="wave wave-3" d="M45,50 A5,5 0 0 1 55,50" />
          </g>
        </svg>
        <div className="loading-text">جاري التحميل...</div>
      </div>
    </>
  );
};

export default Loading;
