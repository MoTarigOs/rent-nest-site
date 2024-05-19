import LoadingGifImage from '@assets/icons/loading_circle.gif';
import Image from 'next/image';
import '@styles/components_styles/LoadingCircle.css';

const LoadingCircle = ({ isLightBg }) => {
  return (
    <div className='loading-circle'>
      <Image src={LoadingGifImage} style={{
        mixBlendMode: isLightBg ? 'multiply' : 'screen'
      }}/>
    </div>
  )
};

export default LoadingCircle;
