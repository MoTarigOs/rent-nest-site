'use client';

import Card from '@components/Card';
import './Admin.css';
import ReviewCard from '@components/ReviewCard';
import { useContext, useEffect, useState } from 'react';
import { getAdminProps, getReports, getUserByEmailAdmin, getUsersAdmin } from '@utils/api';
import HeaderPopup from '@components/popups/HeaderPopup';
import { getRoleArabicName, isValidEmail, propsSections, usersSections } from '@utils/Logic';
import InfoDiv from '@components/InfoDiv';
import Svgs from '@utils/Svgs';
import CustomInputDiv from '@components/CustomInputDiv';
import UserDiv from '@components/UserDiv';
import AdminPart from '@components/AdminPart';
import { Context } from '@utils/Context';
import NotFound from '@components/NotFound';
import MySkeleton from '@components/MySkeleton';

const page = () => {

    const { userId, userRole, loadingUserInfo } = useContext(Context);

    const [fetchingUserInfo, setFetchingUserInfo] = useState(true);

    const [allReportProps, setAllReportProps] = useState([]);

    const [isReportsProps, setIsReportsProps] = useState(false);
    const [isReportsRevs, setIsReportsRevs] = useState(false);
    const [reportsProps, setReportsProps] = useState(false);
    const [reportsRevs, setReportsRevs] = useState(false);
    const [reportPropsSkip, setReportPropsSkip] = useState(0);
    const [reportRevsSkip, setReportRevsSkip] = useState(0);
    const [fetchingReports, setFetchingReports] = useState(false);

    const [isProps, setIsProps] = useState(false);
    const [isPropsFilterDiv, setIsPropsFilterDiv] = useState(false);
    const [propsFilter, setPropsFilter] = useState(propsSections[0]);
    const [propsSkip, setPropsSkip] = useState(0);
    const [fetchingProps, setFetchingProps] = useState(false);
    const [props, setProps] = useState([]);

    const [isUsers, setIsUsers] = useState(false);
    const [isUsersFilterDiv, setIsUsersFilterDiv] = useState(false);
    const [userFilter, setUserFilter] = useState(usersSections[0]);
    const [usersSkip, setUsersSkip] = useState(0);
    const [fetchingUsers, setFetchingUsers] = useState(false);
    const [users, setUsers] = useState([]);

    const [isUserByEmail, setIsUserByEmail] = useState(false);
    const [findingUser, setFindingUser] = useState(false);
    const [userFindEmail, setUserFindEmail] = useState('');
    const [userFindError, setUserFindError] = useState('');
    const [userByEmailItem, setUserByEmailItem] = useState({});

    const fetchReports = async() => {

        try {

            if(fetchingReports) return;

            setFetchingReports(true);

            const res = await getReports();

            if(res.success !== true){
                setFetchingReports(false);
                return;
            };

            let finalArrProps = [];
            let finalArrRevs = [];

            const responedReports = res.dt.reports;
            const responedProps = res.dt.properties;

            for (let i = 0; i < responedReports.length; i++) {
                const xProp = responedProps.find(item => item._id === responedReports[i].reported_id);
                console.log('xProp found: ', xProp);
                if(responedReports[i].reportedTimes > 0 && xProp){
                    finalArrProps.push({
                        ...xProp, report_text: responedReports[i].texts
                    });
                }
                if(responedReports[i].review_writers_ids?.length > 0 && xProp?.reviews?.length > 0){
                    for (let j = 0; j < responedReports[i].review_writers_ids.length; j++) {
                        const matchedRev = xProp.reviews.find(item => item.writer_id === responedReports[i].review_writers_ids[j]);
                        if(matchedRev){
                            finalArrRevs.push({
                                ...matchedRev
                            });
                        }
                    }
                }
            }

            console.log('final arr: ', finalArrProps, finalArrRevs);

            setAllReportProps(responedProps);
            setReportsProps(finalArrProps);
            setReportsRevs(finalArrRevs);
            setFetchingReports(false);
            
        } catch (err) {
            console.log(err.message);
            setFetchingReports(false);
        }

    };

    const fetchProps = async() => {

        try {


            if(fetchingProps) return;

            setFetchingProps(true);

            const res = await getAdminProps(propsFilter.value, propsSkip);

            console.log(res);

            if(res.success !== true) {
                setProps([]);
                setFetchingProps(false);
                return;
            };

            setProps(res.dt);
            setFetchingProps(false);
            
        } catch (err) {
            console.log(err.message);
            setFetchingProps(false);
        }

    };

    const fetchUsers = async() => {

        try {

            if(fetchingUsers) return;

            setFetchingUsers(true);

            const res = await getUsersAdmin(userFilter, usersSkip);

            console.log(res);

            if(res.success !== true) {
                setUsers([]);
                setFetchingUsers(false);
                return;
            };

            setUsers(res.dt);
            setFetchingUsers(false);
            
        } catch (err) {
            console.log(err.message);
            setFetchingUsers(false);
        }

    };

    const findUserByEmail = async() => {

        try {

            if(findingUser) return;

            if(!isValidEmail(userFindEmail).ok){
                setUserFindError('-1');
                return;
            }

            setFindingUser(true);

            setUserByEmailItem({});

            const res = await getUserByEmailAdmin(userFindEmail);

            if(res.success !== true){
                setUserFindError(res.dt);
                setFindingUser(false);
                return;
            }

            setUserFindError('');
            setUserByEmailItem(res.dt);
            setFindingUser(false);
            
        } catch (err) {
            console.log(err.message);
            setFindingUser(false);
        }

    };

    useEffect(() => {
        if(isReportsProps || isReportsRevs) fetchReports();
    }, [isReportsProps, isReportsRevs]);

    useEffect(() => {
        if(isProps) fetchProps();
    }, [isProps, propsFilter]);

    useEffect(() => {
        if(isUsers) fetchUsers();
    }, [isUsers, userFilter]);

    useEffect(() => {
        let timeout;
        if(loadingUserInfo === false) 
            timeout = setTimeout(() => setFetchingUserInfo(false), [1500]);
        return () => clearTimeout(timeout)
    }, [userId, userRole]);

    const navigateToViewFromReview = (rv) => {

        for (let i = 0; i < allReportProps.length; i++) {
            if(allReportProps[i].reviews?.length > 0){
                for (let j = 0; j < allReportProps[i].reviews.length; j++) {
                    if(allReportProps[i]?.reviews[j]?._id === rv._id){
                        location.href = `/view/${allReportProps[i].title.replaceAll(' ', '-')}?id=${allReportProps[i]._id}`
                    }
                }
            }
        }
    };

    if(!userId?.length > 0 || (userRole !== 'admin' && userRole !== 'owner')){
        return (
            fetchingUserInfo ? <MySkeleton /> : <NotFound type={'not allowed'}/>
        )
    }

  return (

    <div className='admin-wrapper'>

        <div className='admin'>

            <h1 id='intro-h1'>صفحة المسؤوول الخاصة بك</h1>

            <p id='intro-p'>تحكم بالموقع و المستخدمين مثل حظر مستخدمين أو حذف عروض أو حذف ملفات وغيره.</p>

            <hr />

            <AdminPart title={'الإِبلاغات عن عروض'} type={'reports'} array={reportsProps} isShow={isReportsProps} setIsShow={setIsReportsProps} skip={reportPropsSkip} setSkip={setReportPropsSkip}/>
            
            <hr />
            
            <AdminPart title={'الإِبلاغات عن مراجعات'} type={'reviews'} array={reportsRevs} isShow={isReportsRevs} setIsShow={setIsReportsRevs} skip={reportRevsSkip} setSkip={setReportRevsSkip} handleReviewNav={navigateToViewFromReview}/>
            
            <hr />

            <AdminPart title={'العروض'} type={'properties'} array={props} 
            isShow={isProps} setIsShow={setIsProps} skip={propsSkip} 
            setSkip={setPropsSkip} isPartFilter={isPropsFilterDiv} 
            setIsPartFilter={setIsPropsFilterDiv} selected={propsFilter}
            setSelected={setPropsFilter} filterArray={propsSections} isFilter={true}/>
            
            <hr />

            <AdminPart title={'مستخدمين المنصة'} type={'users'} array={users} 
            isShow={isUsers} setIsShow={setIsUsers} skip={usersSkip} setSkip={setUsersSkip}
            isFilter={true} filterArray={usersSections} isPartFilter={isUsersFilterDiv}
            setIsPartFilter={setIsUsersFilterDiv} selected={userFilter} 
            setSelected={setUserFilter}/>

            <hr />

            <button className={isUserByEmail ? 'editDiv chngpassbtn' : 'editDiv'} onClick={() => setIsUserByEmail(!isUserByEmail)}>
                ايجاد مستخدم بالايميل 
                <Svgs name={'dropdown arrow'}/>
            </button>
        
            <div className='find-user-by-email' style={{ display: !isUserByEmail ? 'none' : '' }}>

                <CustomInputDiv title={'ادخل بريد المستخدم'} isError={userFindError.length > 0} errorText={userFindError === '-1' ? 'ايميل غير صالح' : ''} value={userFindEmail} listener={(e) => setUserFindEmail(e.target.value)}/>
            
                <button className='btnbackscndclr' onClick={findUserByEmail}>{findingUser ? 'جاري البحث...' : 'البحث'}</button>

                <p id={userFindError?.length > 0 ? 'p-info-error' : 'p-info'}>{userFindError === '-1' ? '' : userFindError}</p>

                <UserDiv isShow={userByEmailItem?._id ? true : false} item={userByEmailItem}/>

            </div>

        </div>

        {(isUsersFilterDiv || isPropsFilterDiv) && <span 
        id='closePopups' onClick={() => { setIsUsersFilterDiv(false); setIsPropsFilterDiv(false)}}/>}

    </div>
  )
};

export default page;
