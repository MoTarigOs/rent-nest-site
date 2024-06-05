'use client';

import './Admin.css';
import { useContext, useEffect, useState } from 'react';
import { deleteSpecificFile, getAdminErrors, getAdminProps, getFiles, getReports, getStorageSize, getUserByEmailAdmin, getUsersAdmin } from '@utils/api';
import {  getReadableFileSizeString, isValidEmail, isValidFilename, propsSections, usersSections } from '@utils/Logic';
import Svgs from '@utils/Svgs';
import CustomInputDiv from '@components/CustomInputDiv';
import UserDiv from '@components/UserDiv';
import AdminPart from '@components/AdminPart';
import { Context } from '@utils/Context';
import NotFound from '@components/NotFound';
import MySkeleton from '@components/MySkeleton';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import { errorsSection } from '@utils/Data';
import LoadingCircle from '@components/LoadingCircle';

const page = () => {

    const { userId, userEmail, userRole, loadingUserInfo, storageKey } = useContext(Context);

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

    const [fetchingFiles, setFetchingFiles] = useState(false);
    const [isFiles, setIsFiles] = useState(false);
    const [storageSize, setStorageSize] = useState('');
    const [files, setFiles] = useState([]);
    const [deleteingFile, setDeletingFile] = useState('');

    const [isErrors, setIsErrors] = useState(false);
    const [isErrorsFilterDiv, setIsErrorsFilterDiv] = useState(false);
    const [errorsFilter, setErrorsFilter] = useState(errorsSection[0]);
    const [errorsSkip, setErrorsSkip] = useState(0);
    const [fetchingErrors, setFetchingErrors] = useState(false);
    const [errors, setErrors] = useState([]);

    const [deletingSpecificFile, setDeletingSpecificFile] = useState(false);
    const [isFileDelete, setIsFileDelete] = useState(false);
    const [fileDeleteError, setFileDeleteError] = useState('');
    const [fileDeleteSuccess, setFileDeleteSuccess] = useState('');
    const [filename, setFilename] = useState('');

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

    const fetchFiles = async() => {

        if(fetchingFiles) return;

        try {

            setFetchingFiles(true);

            const res = await getFiles(storageKey, userEmail);

            if(!res.ok === true){
                setFetchingFiles(false);
                return;
            }

            setFiles(res.dt);

            const sizeRes = await getStorageSize(storageKey, userEmail);

            if(sizeRes.ok) setStorageSize(getReadableFileSizeString(sizeRes?.dt?.size?.toString()));

            setFetchingFiles(false);
            
        } catch (err) {
            console.log(err);
            setFetchingFiles(false);
        }

    };

    const getExtension = (file) => {

        if(file?.split('')?.reverse()?.join('')?.split('.')?.at(0)?.split('')?.reverse()?.join('') === 'png'
            || file?.split('')?.reverse()?.join('')?.split('.')?.at(0)?.split('')?.reverse()?.join('') === 'jpg') 
            return 'img';
    
        if(file?.split('')?.reverse()?.join('')?.split('.')?.at(0)?.split('')?.reverse()?.join('') === 'mp4'
            || file?.split('')?.reverse()?.join('')?.split('.')?.at(0)?.split('')?.reverse()?.join('') === 'avi') 
            return 'video';
    
        return null;    
            
    };

    const deleteThisFile = async(file) => {

        if(deleteingFile === file) return;

        try {

            setDeletingFile(file);

            const res = await deleteSpecificFile(storageKey, userEmail, file);

            if(!res?.success === true){
                setDeletingFile('');
                return;
            }

            setFiles(files.filter(i => i !== file));
            setDeletingFile('');

        } catch (err) {
            console.log(err);
            setDeletingFile('');
        }

    };

    const fetchErrors = async() => {

        try {

            if(fetchingErrors) return;

            setFetchingErrors(true);

            const res = await getAdminErrors(errorsFilter.value, errorsSkip);

            console.log(res);

            if(res.success !== true) {
                setErrors([]);
                setFetchingErrors(false);
                return;
            };

            setErrors(res.dt);
            setFetchingErrors(false);
            
        } catch (err) {
            console.log(err.message);
            setFetchingErrors(false);
        }

    };

    const deleteFileByName = async() => {

        if(deletingSpecificFile) return;

        if(!isValidFilename(filename)){
            setFileDeleteError('اسم ملف غير صالح');
            return;
        }

        try {

            setDeletingSpecificFile(true);

            const res = await deleteSpecificFile(storageKey, userEmail, filename);

            if(!res?.success === true){
                setFileDeleteError(res.dt);
                setFileDeleteSuccess('');
                setDeletingSpecificFile(false);
                return;
            }

            setFileDeleteError('');
            setFileDeleteSuccess('تم حذف الملف بنجاح');
            setDeletingSpecificFile(false);

        } catch (err) {
            console.log(err);
            setDeletingSpecificFile(false);
        }

    };

    const removeFromList = (errorId) => {
        setErrors(errors.filter(i => i._id !== errorId));
    };

    useEffect(() => {
        if(isReportsProps || isReportsRevs) fetchReports();
    }, [isReportsProps, isReportsRevs]);

    useEffect(() => {
        if(isProps) fetchProps();
    }, [isProps, propsFilter, propsSkip]);

    useEffect(() => {
        if(isUsers) fetchUsers();
    }, [isUsers, userFilter, usersSkip]);
    
    useEffect(() => {
        if(isFiles) fetchFiles();
    }, [isFiles]);

    useEffect(() => {
        if(isErrors) fetchErrors();
    }, [isErrors, errorsFilter, errorsSkip]);

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
            fetchingUserInfo ? <MySkeleton isMobileHeader/> : <NotFound type={'not allowed'}/>
        )
    }

  return (

    <div className='admin-wrapper'>

        <div className='admin'>

            <h1 id='intro-h1'>صفحة المسؤوول الخاصة بك</h1>

            <p id='intro-p'>تحكم بالموقع و المستخدمين مثل حظر مستخدمين أو حذف عروض أو حذف ملفات وغيره.</p>

            <hr />

            <AdminPart trigger={() => setIsReportsRevs(false)} title={'الإِبلاغات عن عروض'} isFetching={fetchingReports} type={'reports'} array={reportsProps} isShow={isReportsProps} setIsShow={setIsReportsProps} skip={reportPropsSkip} setSkip={setReportPropsSkip}/>
            
            <hr />
            
            <AdminPart trigger={() => setIsReportsProps(false)} title={'الإِبلاغات عن مراجعات'} isFetching={fetchingReports} type={'reviews'} array={reportsRevs} isShow={isReportsRevs} setIsShow={setIsReportsRevs} skip={reportRevsSkip} setSkip={setReportRevsSkip} handleReviewNav={navigateToViewFromReview}/>
            
            <hr />

            <AdminPart title={'العروض'} isFetching={fetchingProps} type={'properties'} array={props} 
            isShow={isProps} setIsShow={setIsProps} skip={propsSkip} 
            setSkip={setPropsSkip} isPartFilter={isPropsFilterDiv} 
            setIsPartFilter={setIsPropsFilterDiv} selected={propsFilter}
            setSelected={setPropsFilter} filterArray={propsSections} isFilter={true}/>
            
            <hr />

            <AdminPart title={'مستخدمين المنصة'} isFetching={fetchingUsers} type={'users'} array={users} 
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
            
                <button className='btnbackscndclr' onClick={findUserByEmail}>{findingUser ? <LoadingCircle /> : 'البحث'}</button>

                <p id={userFindError?.length > 0 ? 'p-info-error' : 'p-info'}>{userFindError === '-1' ? '' : userFindError}</p>

                <UserDiv isShow={userByEmailItem?._id ? true : false} item={userByEmailItem}/>

            </div>

            <hr />

            <button className={isUserByEmail ? 'editDiv chngpassbtn' : 'editDiv'} onClick={() => setIsFiles(!isFiles)}>
                الملفات المرفوعة على المنصة 
                <Svgs name={'dropdown arrow'}/>
            </button>

            <div className='files-uploaded' style={{ display: isFiles ? null : 'none' }}>

                <button className='filter-btn'>
                    حجم الملفات الكلي <span>{fetchingFiles ? 'جاري الحساب...' : storageSize}</span>
                </button>

                <ul>
                    {(!files?.length > 0 && fetchingFiles) && <li>
                        <Skeleton height={299} width={299}/>    
                    </li>}
                    {files.map((file, index) => (
                        <li key={index}>
                            {getExtension(file) === 'img' ? 
                            <Image width={299} height={299} src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${file}`}/>
                            : getExtension(file) === 'video' && <video width={299} height={299} controls autoPlay loop src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${file}`}/>}
                            <button className='btnbackscndclr' onClick={() => deleteThisFile(file)}>{deleteingFile === file ? 'جاري الحذف...' : 'حذف'}</button>
                        </li>
                    ))}
                </ul>

            </div>

            <hr />

            <button className={isFileDelete ? 'editDiv chngpassbtn' : 'editDiv'} onClick={() => setIsFileDelete(!isFileDelete)}>
                حذف ملف بالاسم 
                <Svgs name={'dropdown arrow'}/>
            </button>
        
            <div className='find-user-by-email' style={{ display: !isFileDelete ? 'none' : '' }}>

                <CustomInputDiv title={'ادخل اسم الملف'} isError={filename === '-1'} errorText={'اسم ملف غير صالح'} value={filename} listener={(e) => setFilename(e.target.value)}/>
            
                <button className='btnbackscndclr' onClick={deleteFileByName}>{deletingSpecificFile ? <LoadingCircle /> : 'حذف الملف'}</button>

                <p id={fileDeleteError?.length > 0 ? 'p-info-error' : 'p-info'}>{fileDeleteError?.length > 0 ? fileDeleteError : fileDeleteSuccess}</p>

            </div>

            <hr />

            <AdminPart title={'الأخطاء و المشاكل'} isFetching={fetchingErrors} type={'users'} array={errors} removeFromList={removeFromList}
            isShow={isErrors} setIsShow={setIsErrors} skip={errorsSkip} 
            setSkip={setErrorsSkip} isPartFilter={isErrorsFilterDiv} 
            setIsPartFilter={setIsErrorsFilterDiv} selected={errorsFilter}
            setSelected={setErrorsFilter} filterArray={errorsSection} isFilter={true}/>

        </div>

        {(isUsersFilterDiv || isPropsFilterDiv) && <span 
        id='closePopups' onClick={() => { setIsUsersFilterDiv(false); setIsPropsFilterDiv(false)}}/>}

    </div>
  )
};

export default page;
