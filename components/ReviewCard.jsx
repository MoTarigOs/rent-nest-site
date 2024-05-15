import '@styles/components_styles/ReviewCard.css';
import Svgs from '@utils/Svgs';

const ReviewCard = ({ 
  item, on_click, setReportDiv, setWriterId, 
  isAdmin, revsToDeleteAdmin, setRevsToDeleteAdmin, 
  isEnglish
}) => {

  const getRatingText = (score) => {
    if(score <= 2.5) return isEnglish ? 'Bad' : 'سيئ';
    if(score > 2.5 && score <= 3.5) return isEnglish ? 'Good' : 'جيد';
    if(score > 3.5 && score < 4.5) return isEnglish ? 'Excellent' : 'ممتاز';
    if(score >= 4.5) return isEnglish ? 'Nice' : 'رائع';
  };

  return (
    <li className='reviewCard' onClick={on_click}>
      
      <div>
        <h3>{item.username}</h3>
        <span><Svgs name={'star'}/>{item.user_rating} • {getRatingText(item.user_rating)}</span>
        <h4 style={{ display: (isAdmin && !revsToDeleteAdmin) ? 'none' : null }} 
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
        </h3>}
      </div>

      <p>{item.text}</p>
      
    </li>
  )
};

export default ReviewCard;
