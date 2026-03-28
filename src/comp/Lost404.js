import React from "react";

const NfcSignalIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4z" />
    <path d="M8.5 10a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
    <path d="M12.5 10a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
    <path d="M16.5 10a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
    <path d="M8.5 14a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
    <path d="M12.5 14a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
    <path d="M16.5 14a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
  </svg>
);

const Lost404 = () => {
  return (
    <div className="nfc-404-container">
      <div className="nfc-card">
        <div className="nfc-icon-wrapper">
          <NfcSignalIcon />
        </div>
        <div className="error-code">404</div>
        <div className="error-status">صفحة ممكن تشتريها</div>
      </div>

      <h1 className="main-title">الظاهر انك بتدور علي حاجة مش موجودة</h1>

      <p className="subtitle">
        الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها، أو أن الرابط
        الذي اتبعته غير صحيح و لكن تقدر تاخدها لحسابك الخاص.
      </p>

      <div className="home-button-wrapper">
        <a href="https://waves.pockethost.io/" className="home-button">
          اتواصل معانا عشان تكون جزء من كيان الشركة
        </a>
      </div>
    </div>
  );
};

export default Lost404;
