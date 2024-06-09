'use client';

import '@styles/components_styles/UserDiv.scss';
import { getNameByLang, getRoleArabicName } from "@utils/Logic";
import InfoDiv from './InfoDiv';
import Link from 'next/link';
import { useState } from 'react';
import { deleteErrorAdmin } from '@utils/api';

const UserDiv = ({ item, isShow, removeFromList, isEnglish }) => {

  const [deleting, setDeleting] = useState(false);

  const deleteError = async() => {

    if(deleting) return;

    try {

      setDeleting(true);

      const res = await deleteErrorAdmin(item._id);

      if(res.success === true) removeFromList(item._id);

      setDeleting(false);
      
    } catch (err) {
      console.log(err);
      setDeleting(false);
    }

  };

  if(!item){
    return (<div></div>)
  }
  
  return (
    <div style={{ display: isShow === false ? 'none' : null, maxWidth: item?.storage_err ? 'fit-content' : null }} className='userDiv'>
        {!item?.storage_err && <Link href={`${isEnglish ? '/en' : ''}/user-profile?id=${item._id}&email=${item.email}&username=${item.username}`} />}
        {item?.username && <InfoDiv title={isEnglish ? 'Username' : 'اسم المستخدم'} value={item.username}/>}
        {item?.email && <InfoDiv title={isEnglish ? 'User Email' : 'بريد المستخدم'} value={item.email}/>}
        {item?.role && <InfoDiv title={isEnglish ? 'User Role' : 'الرتبة'} value={getRoleArabicName(item.role)}/>}
        {item?.isBlocked && <InfoDiv title={isEnglish ? 'Authentication and blocking' : 'التوثيق و الحظر'} value={(item.isBlocked ? 'محظور' : 'غير محظور') + ', ' + (item.email_verified ? 'موثق للحساب' : 'غير موثق')} />}
        {item?.isStorageError && <InfoDiv title={isEnglish ? 'Where the error occurred' : 'مكان حدوث الخطأ'} value={item.isStorageError ? getNameByLang('خطأ في سيرفر تخزين الملفات', isEnglish) : getNameByLang('خطأ في السيرفر الأساسي', isEnglish)}/>}
        {item?.storage_err?.filename && <InfoDiv title={isEnglish ? 'The name of the file in which the error occurred' : 'اسم الملف الذي حدث عنده الخطأ'} value={item.storage_err.filename}/>}
        {item?.storage_err?.code && <InfoDiv title={isEnglish ? 'Error code' : 'رمز الخطأ'} value={item.storage_err.code}/>}
        {item?.storage_err?.stack && <InfoDiv title={isEnglish ? 'Where the error occurred' : 'موضع حدوث الخطأ'} value={item.storage_err.stack}/>}
        {item?.storage_err && <button onClick={() => deleteError(item._id)} className='btnbackscndclr'>{deleting ? getNameByLang('جاري حذف الخطأ...', isEnglish) : getNameByLang('حذف الخطأ', isEnglish)}</button>}
    </div>
  )
};

export default UserDiv;
