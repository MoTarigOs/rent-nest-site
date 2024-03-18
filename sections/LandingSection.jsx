import '@styles/sections_styles/LandingSection.css';
import ImagesShow from '@components/ImagesShow';
import { testImage } from '@utils/Data';

const LandingSection = () => {

  const LandingImagesArray = [
    { _id: '0', title: 'عيش التجربة الأفضل', desc: 'استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية', btnTitle: 'تصفح قائمة البيوت', image: testImage() },
    { _id: '1', title: 'عيش التجربة الأفضل', desc: 'استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية', btnTitle: 'تصفح قائمة البيوت', image: testImage() },
    { _id: '2', title: 'عيش التجربة الأفضل', desc: 'استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية', btnTitle: 'تصفح قائمة البيوت', image: testImage() },
    { _id: '3', title: 'عيش التجربة الأفضل', desc: 'استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية استمتع بعدد من الوحدات السكنية', btnTitle: 'تصفح قائمة البيوت', image:  testImage()},
  ]

  return (

    <div className='landing'>

        <ImagesShow type={'landing'} images={LandingImagesArray} handleWishList={console.log('s')}/>
      
    </div>

  )
};

export default LandingSection;
