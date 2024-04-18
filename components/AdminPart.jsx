'use client';

import { useEffect, useState } from "react";
import Card from "./Card";
import ReviewCard from "./ReviewCard";
import UserDiv from "./UserDiv";
import HeaderPopup from "./popups/HeaderPopup";
import Svgs from "@utils/Svgs";
import Skeleton from "react-loading-skeleton";
import NotFound from "./NotFound";

const AdminPart = ({ 
    trigger, title, type, array, isFetching, isShow, setIsShow, 
    skip, setSkip, isFilter, setIsPartFilter, isPartFilter, 
    filterArray, selected, setSelected, handleReviewNav,
    isEnglish, removeFromList
}) => {

    const [reportText, setReportText] = useState(false);

    useEffect(() => {
        if(!isShow) setSkip(0);
    }, [isShow]);

    return (
        <div className='admin-part'>

            <div className='admin-part-header'>
                
                <button className={isShow ? 'editDiv chngpassbtn' : 'editDiv'} onClick={() => {
                    setIsShow(!isShow); 
                    if(type === 'reports' || type === 'reviews') trigger()
                }}>{title} <Svgs name={'dropdown arrow'}/></button>
            
                {isFilter && <><button style={{ display: !isShow ? 'none' : null }} className='filter-btn'
                    onClick={() => setIsPartFilter(!isPartFilter)}
                >
                    {isEnglish ? 'Catagory' : 'التصنيف'} <span>{isEnglish ? selected.value : selected.arabicName}</span>
                </button>
                
                <HeaderPopup isEnglish={isEnglish} isCustom={isPartFilter} customArray={filterArray}
                    setIsCustom={setIsPartFilter} selectedCustom={selected}
                    setSelectedCustom={setSelected} type={'custom'}/>
                </>}

            </div>

            <ul className="my-list" style={{ display: !isShow && 'none' }}>
                {(!array.length > 0) ? <li className="empty-holder">
                      {isFetching ? <div><Skeleton width={'100%'} height={'100%'}/></div> : <NotFound isEnglish={isEnglish}/>}
                </li> : array.map((item, index) => (
                    <li key={index}>
                        {(type === 'reports' || type === 'properties') ?
                            <><Card type={type} item={item} isEnglish={isEnglish}/>
                            {item.report_text && (!reportText ? <p id="more-report-text-p">{item.report_text[0]}</p> : item.report_text.map((txt) => (<p id="more-report-text-p" onClick={() => setReportText(false)}>{txt}</p>)))}
                            <button className="btnbackscndclr" style={{ display: item.report_text?.length > 1 ? null : 'none' }} id="more-report-text-btn" onClick={() => setReportText(!reportText)}>{reportText ? 'أخفي' : 'أظهر المزيد'}</button></>
                            : type === 'users' 
                                ? <UserDiv item={item} removeFromList={removeFromList} isEnglish={isEnglish}/>
                                : <ReviewCard isEnglish={isEnglish} on_click={() => handleReviewNav(item)} item={item} isAdmin={true}/>}
                    </li>
                ))}
                {array.length > 1 && <button className="btnbackscndclr more-btn" onClick={() => setSkip(skip + 1)}>{isEnglish ? 'Load more' : 'تحميل المزيد'}</button>}
            </ul>

        </div>
    )
};

export default AdminPart
