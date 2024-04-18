import '@styles/components_styles/ReviewCard.css';
import Svgs from '@utils/Svgs';

const ReviewCard = ({ 
  item, on_click, setReportDiv, setWriterId, 
  isAdmin, revsToDeleteAdmin, setRevsToDeleteAdmin, 
  isEnglish
}) => {
  return (
    <li className='reviewCard' onClick={on_click}>
      
      <div>
        <h3>{item.username}</h3>
        <Svgs name={'star'} styling={Math.round(item.user_rating) > 0 ? true : false}/>
        <Svgs name={'star'} styling={Math.round(item.user_rating) > 1 ? true : false}/>
        <Svgs name={'star'} styling={Math.round(item.user_rating) > 2 ? true : false}/>
        <Svgs name={'star'} styling={Math.round(item.user_rating) > 3 ? true : false}/>
        <Svgs name={'star'} styling={Math.round(item.user_rating) > 4 ? true : false}/>
        <span>({item.user_rating})</span>
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
