import '@styles/components_styles/NotFound.css';
import Svgs from '@utils/Svgs';

const NotFound = ({ type }) => {
  return (
    <div className='not-found'>
      {type === 'not allowed' ? 'غير مسموح بتحميل هذه الصفحة' : 'لا يوجد بيانات لعرضها'}
      <Svgs name={'not found'}/>
    </div>
  )
};

export default NotFound;
