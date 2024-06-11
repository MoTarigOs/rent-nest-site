import '@styles/components_styles/ReviewCard.scss';
import { ratingsSections } from '@utils/Data';
import { getReadableDate } from '@utils/Logic';
import Svgs from '@utils/Svgs';

const ReviewCard = ({ 
  item, on_click, setReportDiv, setWriterId, 
  isAdmin, revsToDeleteAdmin, setRevsToDeleteAdmin, 
  isEnglish, isHost
}) => {

  const getRatingText = (score) => {
    const obj = ratingsSections.find(i=>i.value === Math.round(score));
    return (isEnglish ? obj.value : obj.arabicName) + ' ' + obj?.emoji;
  };

  return (
    <li className='reviewCard' onClick={on_click}>
      
      <div className='reviewer-details'>
        <span id='span-image'>{item.username?.at(0)}</span>
        <div className='name-and-rate'>
          <h3>{item.username}</h3>
          <span><Svgs name={'star'}/>{item.user_rating} • {getRatingText(item.user_rating)}</span>
        </div>
      </div>

      {!isHost && <><h4 style={{ display: (isAdmin && !revsToDeleteAdmin) ? 'none' : null }} 
        onClick={() => { 
          if(item.writer_id){ 
            setReportDiv(true); 
            setWriterId(item.writer_id); 
          }
      }}>{isEnglish ? 'Report' : 'إِبلاغ'} <Svgs name={'report'}/></h4>
      {(isAdmin && revsToDeleteAdmin) && <h3 className='delete-file' style={{ display: revsToDeleteAdmin.includes(item) ? 'none' : null }} onClick={() => {
        if(!revsToDeleteAdmin.includes(item.writer_id))
          setRevsToDeleteAdmin([...revsToDeleteAdmin, item]);
      }}>
        {isEnglish ? 'Add to delete basket' : 'اضافة الى السلة'}
        <Svgs name={'delete'}/>
      </h3>}</>}

      {item.updatedAt && <label id='wrote-date'>{getReadableDate(new Date(item.updatedAt), true, isEnglish)}</label>}

      <p>{item.text}</p>
      
    </li>
  )
};

export default ReviewCard;
