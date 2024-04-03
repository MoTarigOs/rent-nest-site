import '@styles/sections_styles/LandingSection.css';
import ImagesShow from '@components/ImagesShow';
import LandImage1 from '@assets/images/landing1.webp';
import LandImage2 from '@assets/images/landing2.webp';
import LandImage3 from '@assets/images/vehcile-for-rent.jpg';

const LandingSection = () => {

  const LandingImagesArray= [
    { _id: '0', title: 'عيش التجربة الأفضل مع رنت نست', desc: 'تصفح قائمتنا من السيارات و العقارات المعروضة للإِيجار, بأسعار و مواصفات مرنة و منوعة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: LandImage1 },
    { _id: '1', title: 'إِيجار منزلك المثالي.', desc: 'تصفح عقارات معروضة للإِيجار في نختلف مدن الاردن.', btnTitle: 'تصفح العقارات', btnLink: '/properties?catagory=apartment', image: LandImage2 },
    { _id: '2', title: 'سيارات تناسب شخصك المثالي', desc: 'تصفح قائمة من مختلف أصناف السيارات, من سيارات كبيرة و ميني باص الى سيارات صالون و رياضية.', btnTitle: 'تصفح السيارات', btnLink: '/vehicles', image: LandImage3 }
  ];
  
  return (

    <div className='landing'>

        <ImagesShow type={'landing'} images={LandingImagesArray} handleWishList={console.log('s')}/>
      
    </div>

  )
};

export default LandingSection;
