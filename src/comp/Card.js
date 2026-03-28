"use client";

import { React, useEffect, useState, useRef } from "react";
import Call from "./Call";
import Story from "./Story";
import Lost404 from "./Lost404";
import Loading from "./Loading";
import {
  FaFacebookSquare,
  FaInstagram,
  FaWhatsapp,
  FaTelegramPlane,
  FaLinkedin,
  FaPhoneAlt,
  FaEnvelope,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaSnapchat,
} from "react-icons/fa";
import PocketBase from "pocketbase";
import VCardBtn from "./vcardBtn";
import ShareButton from "./ShareButton";
import { POCKETBASE_URL } from "../lib/constants";
import { ICON_ASSETS } from "../lib/assets";

const linkStyles = {
  facebook: { icon: <FaFacebookSquare size={65} />, style: { backgroundColor: "#fff", color: "#1877F2" } },
  instagram: { icon: <FaInstagram size={50} />, style: { backgroundColor: "#E4405F", color: "white" } },
  whatsapp: { icon: <FaWhatsapp size={50} />, style: { backgroundColor: "#25D366", color: "white" } },
  telegram: { icon: <FaTelegramPlane size={45} />, style: { backgroundColor: "#2AABEE", color: "white" } },
  linkedin: { icon: <FaLinkedin size={50} />, style: { backgroundColor: "#0A66C2", color: "white" } },
  twitter: { icon: <FaTwitter size={50} />, style: { backgroundColor: "#1DA1F2", color: "white" } },
  youtube: { icon: <FaYoutube size={50} />, style: { backgroundColor: "#FF0000", color: "white" } },
  tiktok: { icon: <FaTiktok size={50} />, style: { backgroundColor: "#010101", color: "white" } },
  snapchat: { icon: <FaSnapchat size={50} />, style: { backgroundColor: "#FFFC00", color: "black" } },
  phone: { icon: <FaPhoneAlt size={50} />, style: { backgroundColor: "#34B7F1", color: "white" } },
  email: { icon: <FaEnvelope size={50} />, style: { backgroundColor: "#EA4335", color: "white" } },
};

function Card({ profileId, initialUserData = null }) {
  const [userData, setUserData] = useState(initialUserData);
  const [loading, setLoading] = useState(!initialUserData);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pbRef = useRef(new PocketBase(POCKETBASE_URL));

  useEffect(() => {
    if (initialUserData) {
      return;
    }

    const fetchUserData = async () => {
      try {
        const record = await pbRef.current.collection("User").getOne(profileId, {
          expand: "stories,regular_users_stories",
        });
        setUserData(record);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("User not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [initialUserData, profileId]);

  const handleAddContact = () => {
    if (!userData) return;

    const phone =
      userData.social_links?.find((l) => l.type?.toLowerCase() === "phone")?.url || "";
    const cleanPhone = phone.replace(/\D/g, "");
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${userData.Name}
ORG:Waves Studio
TITLE:${userData.job}
TEL;TYPE=CELL:+2${cleanPhone}
EMAIL:${userData.email}
URL:https://waves.pockethost.io/${userData.id}
END:VCARD`.trim();

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isIOS) {
      window.open(url, "_self");
    } else {
      window.location.href = url;
    }

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <Loading />;
  if (error || !userData) return <Lost404 />;

  const allLinks = Array.isArray(userData.social_links) ? userData.social_links : [];
  const allStories = [
    ...(userData.expand?.stories ?? []),
    ...(userData.expand?.regular_users_stories ?? []),
  ];

  const phoneNumber =
    allLinks.find((link) => link.type?.toLowerCase() === "phone")?.url || "";
  const emailAddress =
    allLinks.find((link) => link.type?.toLowerCase() === "email")?.url ||
    userData.email ||
    "";
  const socialLinks = allLinks.filter(
    (link) => link?.type && !["phone", "email"].includes(link.type.toLowerCase())
  );
  const isMobile = /Android|iPhone/i.test(navigator.userAgent);
  const avatarUrl = userData.Avatar
    ? pbRef.current.files.getURL(userData, userData.Avatar)
    : "/logo.png";

  return (
    <>
      <ShareButton />
      <div className="nfcPage">
        <div className="productsSec">
          <div className="card">
            <div className="userData">
              <div className="imgHolder" onClick={openModal}>
                <img src={avatarUrl} className="card-img-top" alt={userData.Name} />
              </div>
              <h1 className="notranslate">{userData.Name || "User Name"}</h1>
              <h4 style={{ fontSize: "large" }} className="notranslate">
                {userData.job || "User Job"}
              </h4>
              <h6
                className="bioContainer"
                style={{ fontSize: "1.25rem", lineHeight: "30px" }}
                dangerouslySetInnerHTML={{ __html: userData.Bio }}
              />
            </div>

            <ul className="list-group list-group-flush social-icons-list">
              {socialLinks
                .filter((link) => link.url && linkStyles[link.type.toLowerCase()])
                .map((link, key) => {
                  const linkType = link.type?.toLowerCase();
                  const href =
                    linkType === "whatsapp"
                      ? `https://wa.me/${link.url.replace(/\D/g, "")}`
                      : linkType === "telegram"
                      ? `https://t.me/+${link.url.replace(/\D/g, "")}`
                      : link.url;
                  const iconStyle = linkStyles[linkType]?.style || {};
                  const iconComponent = linkStyles[linkType]?.icon || null;

                  return (
                    <li className="list-group-item social-icon-item" id={linkType} key={key}>
                      <a href={href} target="_blank" rel="noopener noreferrer" title={linkType}>
                        <span className={`${linkType} social-icon-wrapper`} style={iconStyle}>
                          {iconComponent}
                        </span>
                      </a>
                    </li>
                  );
                })}
            </ul>

            <div className="stories d-flex align-items-center flex-column">
              <h3 className="text-center font-bold text-lg border-b pb-2 mb-2">أعمالنا</h3>
              {allStories.map((story) => (
                <Story
                  key={story.id}
                  discStory={story.Product_description}
                  linkTo={story.Product_link}
                  storyTittle={story.Product_name}
                  editbtn={false}
                  imgStory={
                    story.Product_img
                      ? pbRef.current.files.getURL(story, story.Product_img)
                      : "https://placehold.co/100x100/EFEFEF/333333?text=?"
                  }
                />
              ))}
            </div>

            {phoneNumber && <Call telNo={phoneNumber} />}

            {emailAddress && (
              <span className="call gmail">
                <img src={ICON_ASSETS.email} alt="email icon" />
                <p>
                  Mail: <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
                </p>
              </span>
            )}
            <VCardBtn
              classLabel="btnGo vCard vCardDownload me-5"
              label={isMobile ? "حفظ جهة الاتصال" : "تحميل جهة الاتصال"}
              onClick={handleAddContact}
            />
          </div>
        </div>
        {isModalOpen && (
          <div className="image-modal-overlay" onClick={closeModal}>
            <span className="close-modal-button" onClick={closeModal}>
              &times;
            </span>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img src={avatarUrl} alt={userData.Name} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Card;
