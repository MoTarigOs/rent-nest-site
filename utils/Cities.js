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

export function getCityImage(cityValue) {
    switch(cityValue){
        case 'Amman':
            return AmmanCity;
        case 'Dead Sea & Jordan Valley':
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
            return '';
    }
};