import LoadingGifImage from '@assets/icons/loading_circle.gif';
import Image from 'next/image';
import '@styles/components_styles/LoadingCircle.css';

const LoadingCircle = () => {
  return (
    <div className='loading-circle'>
      <Image src={LoadingGifImage} style={{
        filter: 'revert'
      }}/>
    </div>
  )
};

export default LoadingCircle;
