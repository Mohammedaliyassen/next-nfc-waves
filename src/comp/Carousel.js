import Carousel from 'react-bootstrap/Carousel';
import imgS from '../imgs/Textlayer.png';
import imgS1 from '../imgs/ex1.png';
import imgS2 from '../imgs/ex2.png';
import imgS3 from '../imgs/ex3.png';
import imgS4 from '../imgs/FRONT.png';
import imgS5 from '../imgs/BACK.JPG';
import './carousel.css';
import Button from './Button';
function CarouselCard() {
  return (
    <div className='container d-flex justify-content-center align-items-center flex-column'>

      <Carousel className='carouselStyle mt-5 mb-5' controls={false} indicatorLabels={['cool', 'hool', 'suee']}>
        <Carousel.Item>
          <img src={imgS} alt='1st' />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={imgS1} alt='1st' />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={imgS2} alt='1st' />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={imgS3} alt='1st' />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={imgS4} alt='1st' />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={imgS5} alt='1st' />
          <Carousel.Caption>

          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <Button
        classLabel='btnGo mt-1 mb-3'
        label='send us your Design card now'
        to="https://api.whatsapp.com/send/?phone=+201157070765&text&type=phone_number&app_absent=0"
        alt='design yours'
        classLabelForA=' d-flex justify-content-center ms-5 me-5 mt-5'

      />
    </div>
  );
}

export default CarouselCard;