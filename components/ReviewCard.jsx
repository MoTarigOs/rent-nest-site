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
    return (isEnglish ? obj.enName : obj.arabicName) + ' ' + obj?.emoji;
  };

  const isAddedToDeletion = () => {
    if(revsToDeleteAdmin?.find(i => i._id === item._id)) return true;
    else return false;
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

      {!isHost && <>{!isAdmin && <h4 
        onClick={() => { 
          if(item.writer_id){ 
            setReportDiv(true); 
            setWriterId(item.writer_id); 
          }
      }}><Svgs name={'report'}/></h4>}
      {(isAdmin && revsToDeleteAdmin) 
      && <h3 className='delete-file' onClick={() => {
        if(!isAddedToDeletion())
          setRevsToDeleteAdmin([...revsToDeleteAdmin, item]);
      }}>
        {!isAddedToDeletion()
          ? <Svgs name={'delete'}/>
          : (isEnglish ? 'Added to Delete List' : 'تم الاضافة الى قائمة الحذف')}
      </h3>}</>}

      {item.updatedAt && <label id='wrote-date'>{getReadableDate(new Date(item.updatedAt), true, isEnglish)}</label>}

      <p>{item.text}</p>
      
    </li>
  )
};

export default ReviewCard;
