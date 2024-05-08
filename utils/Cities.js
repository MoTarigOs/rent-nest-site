 /* 
    يجب أن تضيف صورة المدينة الى فولدر 
    assets/cities

    ثم في هذا الملف Cities.js

    قم باستيراد الصورة مثل
    import AmmanCity from @assets/cities/amman-city.jpg

    وضيفها الى 
    function getCityImage(cityValue) {
    switch(cityValue){
        ...
        case 'amman':
        return AmmanCity;
    }
    }

    و بعدها اذعب الى ملف
    utils/Data.js

    في
    export const JordanCities

    : قم اضافة المدينة بهذا الشكل
    
    {
    city_id: <اكتب اخر ايدي, مثلا اذا كانت المدينة السابقة 3 اكتب هنا 4 وهكذا>,
    value: <اسم المدينة بالانجليزي مثل Amman>,       
    arabicName: <اسم المدينة بالعربي مثل عمان>,   
    long: <خط طول جغرافي للمدينة>,        
    lat: <خط عرض جغرافي للمدينة>
    }

*/

import imageee from '@assets/images/about-section-background.webp';

import AmmanCity from '@assets/cities/amman-city.webp';
import DeadSea from '@assets/cities/deadsea-city.webp';
import AjlounCity from '@assets/cities/ajloun-city.webp';
import IrbidCity from '@assets/cities/irbid-city.webp';
import AlaqabaCity from '@assets/cities/alaqaba-city.webp';
import PetraCity from '@assets/cities/betraa-city.webp';
import SaltCity from '@assets/cities/salt-city.webp';
import MadabaCity from '@assets/cities/madaba-city.webp';
import KarakCity  from '@assets/cities/karak-city.webp';
import ZarqaCity from '@assets/cities/zarqa-city.webp';
import MainCity from '@assets/cities/main-city.webp';
import MafraqCity from '@assets/cities/mofrag-city.webp';
import TafilaCity from '@assets/cities/tafila-city.webp';
import JerashCity from '@assets/cities/jerach-city.webp';

export function getCityImage(cityValue) {
    switch(cityValue){
        case 'Amman':
            return AmmanCity;
        case 'Dead Sea and Jordan Valley':
            return DeadSea;
        case 'Ajloun':
            return AjlounCity;
        case 'Irbid':
            return IrbidCity;
        case 'Aqaba':
            return AlaqabaCity;
        case 'Wadi Rum and Petra':
            return PetraCity;
        case 'As-Salt':
            return SaltCity;
        case 'Madaba':
            return MadabaCity;
        case 'Karak':
            return KarakCity;
        case 'Zarqa':
            return ZarqaCity;
        case 'Main':
            return MainCity;
        case 'Mafraq':
            return MafraqCity;
        case 'Tafilah':
            return TafilaCity;
        case 'Jerash':
            return JerashCity;
        default:
            return imageee;
    }
};