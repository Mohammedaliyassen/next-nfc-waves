"use client";

import CarouselCard from "./Carousel";
import TopHome from "./TopHome";
import Footer from "./Footer";
import QaComponent from "./QA";
import { HowItWorks } from "./HowItWorks";
import { SHOWCASE_ASSETS } from "../lib/assets";

function HomePage() {
    return (
        <div className="homePage">
            <TopHome
                src1={SHOWCASE_ASSETS.frontCard}
                src2={SHOWCASE_ASSETS.backCard}
            />
            <CarouselCard />
            <HowItWorks />
            <QaComponent />
            <Footer />
        </div>
    );
}

export default HomePage;
