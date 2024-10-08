import '@styles/sections_styles/LandingSection.scss';
import ImagesShow from '@components/ImagesShow';
import { getCityImage } from '@utils/Cities';
import { JordanCities } from '@utils/Data';

const LandImage1 = getCityImage('Aqaba');
const AmmanCity = getCityImage('Amman');
const DeadSea = getCityImage('Dead Sea and Jordan Valley');
const AjlounCity = getCityImage('Ajloun');
const IrbidCity = getCityImage('Irbid');
const AlaqabaCity = getCityImage('Aqaba');
const PetraCity = getCityImage('Wadi Rum and Petra');
const SaltCity = getCityImage('As-Salt');
const MadabaCity = getCityImage('Madaba');
const KarakCity  = getCityImage('Karak');
const ZarqaCity = getCityImage('Zarqa');
const MainCity = getCityImage('Main');
const MafraqCity = getCityImage('Mafraq');
const TafilaCity = getCityImage('Tafilah');
const JerashCity = getCityImage('Jerash');

const LandingSection = ({ isEnglish }) => {

  const LandingImagesArray= !isEnglish ? [
    { _id: '0', title: 'Rent Nest حيث تجتمع الفخامة و الراحة معاً ', desc: 'اكتشف الحياة الأنيقة في عقاراتنا المستأجرة بعناية. في Rent Nest، نحن نمزج بين الفخامة والراحة، ونقدم لك أسلوب حياة راقي.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: LandImage1 },
    { _id: '1', btnCity: JordanCities[0], title: 'متعة التجوال و السهر و التسوق بالعاصمة عمان', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: AmmanCity },
    { _id: '2', btnCity: JordanCities[3], title: 'احجز بأجمل المنتجعات العلاجية بالبحر الميت', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: DeadSea },
    { _id: '3', btnCity: JordanCities[2], title: 'الصيف البارد و الجبال الخضراء في عجلون', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: AjlounCity },
    { _id: '4', btnCity: JordanCities[8], title: 'سحر الطبيعة الاجمل عروس الشمال اربد', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: IrbidCity },
    { _id: '5', btnCity: JordanCities[7], title: 'تعال الى ثغر الاردن الباسم العقبة', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: AlaqabaCity },
    { _id: '6', btnCity: JordanCities[4], title: 'لا تنسى تزور عجيبة الدنيا و مريخ الارض وادي رم و البتراء', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: PetraCity },
    { _id: '7', btnCity: JordanCities[6], title: ' الاصالة و الجمال في المدينة القديمة السلط', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: SaltCity },
    { _id: '8', btnCity: JordanCities[9], title: 'اجمل لوحات الفسيفساء و المغطس في مادبا', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: MadabaCity },
    { _id: '9', btnCity: JordanCities[10], title: 'الكرم و الجود و أضرحة الصحابة في الكرك', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: KarakCity },
    { _id: '10', btnCity: JordanCities[12], title: 'أجمل القصور التاريخية في الزرقاء', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: ZarqaCity },
    { _id: '11', btnCity: JordanCities[5], title: 'السياحة العلاجية الافضل في حمامات ماعين', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: MainCity },
    { _id: '12', btnCity: JordanCities[11], title: 'الاثار النبطية ام الجمال و قصر برقع في المفرق', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: MafraqCity },
    { _id: '13', btnCity: JordanCities[13], title: 'المحميات الطبيعية و الشلالات في الطفيلة', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: TafilaCity },
    { _id: '14', btnCity: JordanCities[1], title: 'استمتع بالتاريخ بالمدينة الأثرية جرش', desc: 'في Rent Nest، نحن ملتزمون بتبسيط عملية البحث عن عقارات للإيجار. سواء كنت تبحث عن شقة مريحة، أو منزل واسع، أو منتجع، لدينا خيارات تناسب كل أنماط الحياة.', btnTitle: 'الذهاب الى صفحة البحث', btnLink: '/search', image: JerashCity },
  ] : [
    { _id: '0', btnCity: JordanCities[0], title: 'Rent Nest Where luxury meets convenience', desc: 'Discover elegant living in our meticulously curated rental properties. At Rent Nest, we blend opulence with comfort, offering you a refined lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: LandImage1 },
    { _id: '1', btnCity: JordanCities[0], title: 'Enjoy roaming, staying up late, and shopping in the capital, Amman', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: AmmanCity },
    { _id: '2', btnCity: JordanCities[3], title: 'Book at the most beautiful medical resorts in the Dead Sea', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: DeadSea },
    { _id: '3', btnCity: JordanCities[2], title: 'Cool summer and green mountains in Ajloun', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: AjlounCity },
    { _id: '4', btnCity: JordanCities[8], title: 'he magic of nature, the most beautiful bride of the north, Irbid', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: IrbidCity },
    { _id: '5', btnCity: JordanCities[7], title: 'Come to the smiling port of Jordan, Aqaba', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: AlaqabaCity },
    { _id: '6', btnCity: JordanCities[4], title: 'Do not forget to visit the wonder of the world, Mars, Wadi Rum, and Petra', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: PetraCity },
    { _id: '7', btnCity: JordanCities[6], title: 'Authenticity and beauty in the old city of Salt', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: SaltCity },
    { _id: '8', btnCity: JordanCities[9], title: 'The most beautiful mosaics and bathtubs in Madaba', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: MadabaCity },
    { _id: '9', btnCity: JordanCities[10], title: 'Generosity, generosity, and the shrines of the Companions in Karak', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: KarakCity },
    { _id: '10', btnCity: JordanCities[12], title: 'The most beautiful historical palaces in Zarqa', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: ZarqaCity },
    { _id: '11', btnCity: JordanCities[5], title: `Medical tourism is the best in Hammamet Ma'in`, desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: MainCity },
    { _id: '12', btnCity: JordanCities[11], title: 'Nabataean antiquities, Umm al-Jimal and Burqa Palace in Mafraq', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: MafraqCity },
    { _id: '13', btnCity: JordanCities[13], title: 'Nature reserves and waterfalls in Tafila', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: TafilaCity },
    { _id: '14', btnCity: JordanCities[1], title: 'Enjoy the history of the ancient city of Jerash', desc: 'At Rent Nest, we’re dedicated to simplifying your search for quality rental properties. Whether you’re seeking a cozy apartment, a spacious house, or a trendy loft, we’ve got options to suit every lifestyle.', btnTitle: 'go to search page', btnLink: '/en/search', image: JerashCity }
  ];
  
  return (

    <div className='landing disable-text-copy'>

        <ImagesShow useHooks isEnglish={isEnglish} type={'landing'} images={LandingImagesArray}/>
      
    </div>

  )
};

export default LandingSection;
