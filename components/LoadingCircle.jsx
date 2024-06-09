import LoadingGifImage from '@assets/icons/loading_circle.gif';
import Image from 'next/image';
import '@styles/components_styles/LoadingCircle.scss';

const LoadingCircle = ({ isLightBg, myStyle, bgColor }) => {
  return (
    <div style={myStyle} className='loading-circle'>
      <Image src={LoadingGifImage} style={{
        mixBlendMode: isLightBg ? 'multiply' : 'screen'
      }}/>
      {bgColor && <div id='overlay-div' style={{ background: bgColor }}/>}
    </div>
  )
};

export default LoadingCircle;
