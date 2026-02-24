import CarouselCard from "./Carousel";
import TopHome from "./TopHome";
import Footer from "./Footer";
import cardNFC from "../imgs/FRONT.png"
import backCardNFC from "../imgs/BACK.JPG"
import './HomePage.css'
import QaComponent from "./QA";
// import HeroSection from "./HeroSection";
function HomePage() {
    return (
        <>
            <div className="homePage">
                <TopHome src1={cardNFC} src2={backCardNFC} />
                {/* <HeroSection /> */}
                <CarouselCard />
                <QaComponent />
                <Footer />
            </div>
        </>
    );
}

export default HomePage;