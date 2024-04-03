import '@styles/components_styles/UserDiv.css';
import { getRoleArabicName } from "@utils/Logic";
import InfoDiv from './InfoDiv';

const UserDiv = ({ item, isShow }) => {

  if(!item){
    return (<div></div>)
  }
  
  return (
    <div style={{ display: isShow === false ? 'none' : null }} className='userDiv' onClick={() => location.href = `/user-profile?id=${item._id}&email=${item.email}&username=${item.username}`}>
        <InfoDiv title={'اسم المستخدم'} value={item.username}/>
        <InfoDiv title={'بريد المستخدم'} value={item.email}/>
        <InfoDiv title={'الرتبة'} value={getRoleArabicName(item.role)}/>
        <InfoDiv title={'التوثيق و الحظر'} value={(item.isBlocked ? 'محظور' : 'غير محظور') + ', ' + (item.email_verified ? 'موثق للحساب' : 'غير موثق')} />
    </div>
  )
};

export default UserDiv;
