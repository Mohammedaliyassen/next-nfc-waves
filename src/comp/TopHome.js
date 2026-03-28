"use client";

import Button from "./Button";
import Call from "./Call";
import React, { useState } from "react";
import Image from "next/image";
import { ICON_ASSETS } from "../lib/assets";

function TopHome(props) {
    const { src1, src2 } = props;
    const [isFlipped, setIsFlipped] = useState(false);

    const handleMouseEnter = () => {
        setIsFlipped(true);
    };

    const handleMouseLeave = () => {
        setIsFlipped(false);
    };

    return (
        <div className="container">
            <div className="row">
                <div
                    className="col-lg-6 col-sm-12 col-md-12 mt-5 mb-5 imgSide"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setIsFlipped((current) => !current)}
                >
                    <div className={`cardScene ${isFlipped ? "is-flipped" : ""}`}>
                        <div className="cardSurface">
                            <div className="cardFace cardFront">
                                <span className="cardFrame">
                                    <Image
                                        src={src1}
                                        alt="واجهة كارت Waves NFC"
                                        priority
                                        sizes="(max-width: 768px) 90vw, 40vw"
                                    />
                                </span>
                            </div>
                            <div className="cardFace cardBack">
                                <span className="cardFrame">
                                    <Image
                                        src={src2}
                                        alt="خلفية كارت Waves NFC"
                                        priority
                                        sizes="(max-width: 768px) 90vw, 40vw"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-sm-12 mt-5 mb-5 col-md-12 topHomeContent">
                    <h1>بطاقة Waves NFC الذكية</h1>
                    <p className="caption">
                        وسيلة احترافية وسريعة لعرض بياناتك وروابطك وأعمالك في لحظة
                        واحدة، بدون ورق وبدون شرح طويل.
                    </p>
                    <span className="keyFea">المهام الرئيسية للكارت</span>
                    <ul className="topHomeList">
                        <li>مشاركة بيانات التواصل والسوشيال ميديا بمجرد تمرير الكارت.</li>
                        <li>عرض البروفايل الشخصي أو التجاري بشكل منظم واحترافي.</li>
                        <li>إظهار الأعمال والخدمات والروابط المهمة في صفحة واحدة.</li>
                        <li>تحديث بياناتك مستقبلًا بدون الحاجة لإعادة طباعة كل شيء.</li>
                        <li>تخصيص التصميم بما يناسب هويتك أو البراند الخاص بك.</li>
                    </ul>
                    <div className="signBTNs">
                        <Button
                            classLabel="btnGo mt-1 mb-3"
                            label="اطلب كارتك الآن"
                            to="https://api.whatsapp.com/send/?phone=01095303755&text&type=phone_number&app_absent=0"
                        />
                        <Button classLabel="btnGo mt-1 mb-3" label="تسجيل الدخول" to="/login" />
                    </div>
                    <Call telNo="01095303755" />
                    <a href="mailto:waves.devtech@gmail.com" className="call gmail">
                        <img src={ICON_ASSETS.email} alt="email icon" />
                        <p>
                            البريد:{" "}
                            <a href="mailto:waves.devtech@gmail.com">
                                waves.devtech@gmail.com
                            </a>
                        </p>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default TopHome;
