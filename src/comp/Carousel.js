import Carousel from 'react-bootstrap/Carousel';
import Image from 'next/image';
import Button from './Button';
import { SHOWCASE_ASSETS } from '../lib/assets';
import "./carousel.css";
function CarouselCard() {
  return (
    <div className='container d-flex justify-content-center align-items-center flex-column'>

      <Carousel className='carouselStyle mt-5 mb-5' controls={false} indicatorLabels={['cool', 'hool', 'suee']}>
        <Carousel.Item>
          <Image src={SHOWCASE_ASSETS.textLayer} alt='1st' priority />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image src={SHOWCASE_ASSETS.example1} alt='1st' />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image src={SHOWCASE_ASSETS.example2} alt='1st' />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image src={SHOWCASE_ASSETS.example3} alt='1st' />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image src={SHOWCASE_ASSETS.frontCard} alt='1st' />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image src={SHOWCASE_ASSETS.backCard} alt='1st' />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <Button
        classLabel='btnGo mt-1 mb-3'
        label='send us your Design card now'
        to="https://api.whatsapp.com/send/?phone=201095303755&text&type=phone_number&app_absent=0"
        alt='design yours'
        classLabelForA=' d-flex justify-content-center ms-5 me-5 mt-5'

      />
    </div>
  );
}

export default CarouselCard;
