import React, { useState } from 'react';
import { FaShareAlt, FaFacebook, FaWhatsapp, FaLinkedin, FaTwitter, FaCopy } from 'react-icons/fa';

const ShareButton = () => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const url = window.location.href;
  const text = document.title || "Check out this page!";

  const shareOptions = [
    {
      name: 'Facebook',
      icon: <FaFacebook size={25} />,
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      className: 'facebook',
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp size={25} />,
      shareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`,
      className: 'whatsapp',
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin size={25} />,
      shareUrl: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      className: 'linkedin',
    },
    {
        name: 'Twitter',
        icon: <FaTwitter size={25} />,
        shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        className: 'twitter',
    },
    {
        name: 'Copy Link',
        icon: <FaCopy size={25} />,
        className: 'copy-link',
        action: () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(() => {
                    alert('Link copied to clipboard!');
                    setShowShareOptions(false);
                });
            } else {
                window.prompt("Copy this link:", url);
                setShowShareOptions(false);
            }
        }
    }
  ];

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleShare = async (option) => {
    // The modern 'navigator.share' API for mobile devices
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: text,
          url: url,
        });
        setShowShareOptions(false);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
        // Fallback for desktop or unsupported browsers
        if (option.action) {
            option.action();
        } else if (option.shareUrl) {
            window.open(option.shareUrl, '_blank', 'noopener,noreferrer');
            setShowShareOptions(false);
        }
    }
  };

  return (
    <div className="fab-container">
      <div className="fab-share-button" onClick={toggleShareOptions}>
        <FaShareAlt size={24} />
      </div>
      <div className={`fab-share-options ${showShareOptions ? 'show' : ''}`}>
        {shareOptions.map((option) => (
          <button
            key={option.name}
            className={`fab-share-option ${option.className}`}
            onClick={() => handleShare(option)}
            title={option.name}
          >
            {option.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShareButton;
