'use client';

import { useEffect, useState } from "react";
import Card from "./Card";
import ReviewCard from "./ReviewCard";
import UserDiv from "./UserDiv";
import HeaderPopup from "./popups/HeaderPopup";
import Svgs from "@utils/Svgs";
import Skeleton from "react-loading-skeleton";
import NotFound from "./NotFound";
import LoadingCircle from "./LoadingCircle";
import PagesHandler from "./PagesHandler";

const AdminPart = ({ 
    trigger, title, type, array, isFetching, isShow, setIsShow, 
    skip, setSkip, isFilter, setIsPartFilter, isPartFilter, 
    filterArray, selected, setSelected, handleReviewNav,
    isEnglish, removeFromList, cardsPerPage, fetchArr,
    foundItems
}) => {

    const [reportText, setReportText] = useState(false);
    const [indexSlide, setIndexSlide] = useState(0);

    useEffect(() => {
        if(!isShow) setSkip(0);
    }, [isShow]);

    return (
        <div className='admin-part'>

            <ul className="my-list">
                {(!array.length > 0 || isFetching) ? <li className="empty-holder">
                      {isFetching ? <div><Skeleton width={'100%'} height={'100%'}/></div> : <NotFound isEnglish={isEnglish}/>}
                </li> : array.map((item, index) => (
                    <li key={index}>
                        {(type === 'reports' || type === 'properties') ?
                            <><Card type={'myProp'} isReported={type === 'reports'} item={item} isAdmin isEnglish={isEnglish}/>
                            {isEnglish ? 'Reports Texts' : 'ملاحظات الابلاغ'}
                            {item.report_text && (!reportText ? <p id="more-report-text-p">{item.report_text[0]}</p> : item.report_text.map((txt) => (<p id="more-report-text-p" onClick={() => setReportText(false)}>{txt}</p>)))}
                            <button className="btnbackscndclr" style={{ display: item.report_text?.length > 1 ? null : 'none' }} id="more-report-text-btn" onClick={() => setReportText(!reportText)}>{reportText ? (isEnglish ? 'Hide' : 'أخفي') : (isEnglish ? 'Show More' : 'أظهر المزيد')}</button></>
                            : type === 'users' 
                                ? <UserDiv item={item} removeFromList={removeFromList} isEnglish={isEnglish}/>
                                : <ReviewCard isEnglish={isEnglish} on_click={() => handleReviewNav(item)} item={item} isAdmin={true}/>}
                    </li>
                ))}
            </ul>

            {fetchArr && <PagesHandler cardsPerPage={cardsPerPage} foundItems={foundItems} 
                triggerPropsArrayFetch={fetchArr}
                indexSlide={indexSlide} setIndexSlide={setIndexSlide}/>}

        </div>
    )
};

export default AdminPart
