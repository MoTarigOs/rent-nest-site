import '@styles/components_styles/NotFound.css';
import Svgs from '@utils/Svgs';

const NotFound = ({ type, isEnglish }) => {

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
      {getText()}
      <Svgs name={'not found'}/>
    </div>
  )
};

export default NotFound;
