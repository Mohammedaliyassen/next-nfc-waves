
import Button from "./Button";
import Call from "./Call";
import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import mail from '../imgs/gmail.png';
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
        <div className="container" >
            <div className="row">
                <div className="col-lg-6 col-sm-12 col-md-12 mt-5 mb-5 imgSide "
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <ReactCardFlip
                        isFlipped={isFlipped}
                        flipDirection="horizontal"
                        className="w-100 react-card-flip"
                    >
                        <div className="front"
                        >
                            <span><img src={src1} alt="NFC Card" /></span>
                        </div>
                        <div className="back">
                            <span><img src={src2} alt="NFC Card" /></span>
                        </div>
                    </ReactCardFlip>

                </div>
                <div className="col-lg-6 col-sm-12 mt-5 mb-5 col-md-12">
                    <h1>Waves NFC</h1>
                    <p className="caption">
                        Revolutionizing how you showcase your work with a customizable NFC card.
                    </p>
                    <span className="keyFea">Key Features</span>
                    <ul className="text-start">
                        <li>Edit your email directly through the card's interface.</li>
                        <li>Display your portfolio or projects in an interactive way.</li>
                        <li>Share your contact details effortlessly with a single tap.</li>
                        <li>Fully customizable to match your personal or brand identity.</li>
                    </ul>
                    <div className="signBTNs">
                        <Button classLabel='btnGo mt-1 mb-3' label='connect us' to="https://api.whatsapp.com/send/?phone=01095303755&text&type=phone_number&app_absent=0" />
                        <Button classLabel='btnGo mt-1 mb-3' label='Sign In' to="https://waves.pockethost.io/login" />
                    </div>
                    <Call telNo='01095303755' />
                    <a href="mailto:waves.devtech@gmail.com" className="call gmail">
                        <img src={mail} alt="email icon" />
                        <p>Mail: <a href={`mailto:waves.devtech@gmail.com`}>waves.devtech@gmail.com</a></p>
                    </a>
                </div>
            </div>
        </div >
    );
}

export default TopHome;