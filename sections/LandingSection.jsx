import '@styles/sections_styles/LandingSection.css';
import ImagesShow from '@components/ImagesShow';
import LandImage1 from '@assets/cities/alaqaba-city.jpg';
import LandImage2 from '@assets/cities/alaqaba-city.jpg';
import LandImage3 from '@assets/cities/alaqaba-city.jpg';
import AmmanCity from '@assets/cities/amman-city.jpg';
import DeadSea from '@assets/cities/deadsea-city.jpg';
import AjlounCity from '@assets/cities/ajloun-city.jpg';
import IrbidCity from '@assets/cities/irbid-city.jpg';
import AlaqabaCity from '@assets/cities/alaqaba-city.jpg';
import PetraCity from '@assets/cities/petra-city.jpg';
import SaltCity from '@assets/cities/salt-city.jpg';
import MadabaCity from '@assets/cities/madaba-city.jpg';
import KarakCity  from '@assets/cities/karak-city.jpg';
import ZarqaCity from '@assets/cities/zarqa-city.jpg';
import MainCity from '@assets/cities/main-city.jpg';
import MafraqCity from '@assets/cities/mafrag-city.jpg';
import TafilaCity from '@assets/cities/tafila-city.jpg';
import JerashCity from '@assets/cities/jerach-city.jpg';

const LandingSection = ({ isEnglish }) => {

  const LandingImagesArray= !isEnglish ? [
    { _id: '0', title: 'Rent Nest حيث تجتمع الفخامة و الراحة معاً ', desc: 'اكتشف الحياة الأنيقة في عقاراتنا المستأجرة بعناية. في Rent Nest، نحن نمزج بين الفخامة والراحة، ونقدم لك أسلوب حياة راقي.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: LandImage1 },
    { _id: '1', title: 'متعة التجوال و السهر و التسوق بالعاصمة عمان', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: AmmanCity },
    { _id: '2', title: 'احجز بأجمل المنتجعات العلاجية بالبحر الميت', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: DeadSea },
    { _id: '3', title: 'الصيف البارد و الجبال الخضراء في عجلون', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: AjlounCity },
    { _id: '4', title: 'سحر الطبيعة الاجمل عروس الشمال اربد', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: IrbidCity },
    { _id: '5', title: 'تعال الى ثغر الاردن الباسم العقبة', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: AlaqabaCity },
    { _id: '6', title: 'لا تنسى تزور عجيبة الدنيا و مريخ الارض وادي رم و البتراء', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: PetraCity },
    { _id: '7', title: ' الاصالة و الجمال في المدينة القديمة السلط', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: SaltCity },
    { _id: '8', title: 'اجمل لوحات الفسيفساء و المغطس في مادبا', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: MadabaCity },
    { _id: '9', title: 'الكرم و الجود و أضرحة الصحابة في الكرك', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: KarakCity },
    { _id: '10', title: 'أجمل القصور التاريخية في الزرقاء', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: ZarqaCity },
    { _id: '11', title: 'السياحة العلاجية الافضل في حمامات ماعين', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: MainCity },
    { _id: '12', title: 'الاثار النبطية ام الجمال و قصر برقع في المفرق', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: MafraqCity },
    { _id: '13', title: 'المحميات الطبيعية و الشلالات في الطفيلة', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: TafilaCity },
    { _id: '14', title: 'استمتع بالتاريخ بالمدينة الأثرية جرش', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: JerashCity },
  ] : [
    { _id: '0', title: 'Rent Nest Where luxury meets convenience', desc: 'Discover elegant living in our meticulously curated rental properties. At Rent Nest, we blend opulence with comfort, offering you a refined lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: LandImage1 },
    { _id: '1', title: 'Enjoy roaming, staying up late, and shopping in the capital, Amman', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: AmmanCity },
    { _id: '2', title: 'Book at the most beautiful medical resorts in the Dead Sea', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: DeadSea },
    { _id: '3', title: 'Cool summer and green mountains in Ajloun', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: AjlounCity },
    { _id: '4', title: 'he magic of nature, the most beautiful bride of the north, Irbid', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: IrbidCity },
    { _id: '5', title: 'Come to the smiling port of Jordan, Aqaba', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: AlaqabaCity },
    { _id: '6', title: 'Do not forget to visit the wonder of the world, Mars, Wadi Rum, and Petra', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: PetraCity },
    { _id: '7', title: 'Authenticity and beauty in the old city of Salt', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: SaltCity },
    { _id: '8', title: 'The most beautiful mosaics and bathtubs in Madaba', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: MadabaCity },
    { _id: '9', title: 'Generosity, generosity, and the shrines of the Companions in Karak', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: KarakCity },
    { _id: '10', title: 'The most beautiful historical palaces in Zarqa', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: ZarqaCity },
    { _id: '11', title: `Medical tourism is the best in Hammamet Ma'in`, desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: MainCity },
    { _id: '12', title: 'Nabataean antiquities, Umm al-Jimal and Burqa Palace in Mafraq', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: MafraqCity },
    { _id: '13', title: 'Nature reserves and waterfalls in Tafila', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: TafilaCity },
    { _id: '14', title: 'Enjoy the history of the ancient city of Jerash', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: JerashCity }
  ];
  
  return (

    <div className='landing'>

        <ImagesShow isEnglish={isEnglish} type={'landing'} images={LandingImagesArray} handleWishList={console.log('s')}/>
      
    </div>

  )
};

export default LandingSection;
