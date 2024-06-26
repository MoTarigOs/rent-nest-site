'use client';

import '@styles/components_styles/NotFound.scss';
import { Context } from '@utils/Context';
import Svgs from '@utils/Svgs';
import Link from 'next/link';
import { useContext } from 'react';

const NotFound = ({ type, isEnglish, navToVerify }) => {

  const { userId } = useContext(Context);

  const getText = () => {
    switch(type){
      case 'not allowed':
        return isEnglish ? 'Loading of this page is not permitted' : 'غير مسموح بتحميل هذه الصفحة';
      case 'user id exist':
        return isEnglish ? 'Please log out first and then return to this page' : 'الرجاء تسجيل الخروج اولا ثم العودة الى هذه الصفحة';
      default:
        return isEnglish ? 'There is no data to display' : 'لا يوجد بيانات لعرضها';  
    }
  };

  return (
    <div className='not-found'>
      <div className='main-text'>
        {getText()}
        <Svgs name={'not found'}/>
      </div>
      {(navToVerify && userId?.length > 10) && <Link style={{margin: 0}} href={isEnglish ? '/en/verify-account' : '/verify-account'}>
        {isEnglish ? 'Verify account from here' : 'قم بتوثيق حسابك من هنا'}
      </Link>}
    </div>
  )
};

export default NotFound;
