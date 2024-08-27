'use client';

import './Admin.scss';
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
import PropertiesArray from '@components/PropertiesArray';
import Notif from '@components/popups/Notif';
import PagesHandler from '@components/PagesHandler';
import { motion } from 'framer-motion';

const page = () => {

    const { 
        userId, userEmail, userRole, 
        loadingUserInfo, storageKey, isMobile960 
    } = useContext(Context);

    const [sectionType, setSectionType] = useState('notif');
    const [isSideNav, setIsSideNav] = useState(false);

    const [fetchingUserInfo, setFetchingUserInfo] = useState(true);

    const [allReportProps, setAllReportProps] = useState([]);

    const [isReportsProps, setIsReportsProps] = useState(false);
    const [isReportsRevs, setIsReportsRevs] = useState(false);
    const [reportsProps, setReportsProps] = useState(false);
    const [reportsRevs, setReportsRevs] = useState(false);
    const [reportPropsSkip, setReportPropsSkip] = useState(0);
    const [reportRevsSkip, setReportRevsSkip] = useState(0);
    const [fetchingReports, setFetchingReports] = useState(false);
    const [foundReports, setFoundReports] = useState(0);
    const [foundRevsReports, setRevsFoundReports] = useState(0);

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
    const [foundErrors, setFoundErros] = useState(0);

    const [deletingSpecificFile, setDeletingSpecificFile] = useState(false);
    const [isFileDelete, setIsFileDelete] = useState(false);
    const [fileDeleteError, setFileDeleteError] = useState('');
    const [fileDeleteSuccess, setFileDeleteSuccess] = useState('');
    const [filename, setFilename] = useState('');

    const cardsPerPage = 100;

    const fetchReports = async(skipCount) => {

        try {

            if(fetchingReports) return;

            setFetchingReports(true);

            const res = await getReports(false, cardsPerPage, skipCount || 0);

            if(res.success !== true){
                setFetchingReports(false);
                setFoundReports(0);
                setRevsFoundReports(0);
                return;
            };

            let finalArrProps = [];
            let finalArrRevs = [];

            const responedReports = res.dt.reports;
            const responedProps = res.dt.properties;
            const count = res.dt.count;

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

            if(finalArrProps?.length <= 0) setFoundReports(0);
            if(finalArrRevs?.length <= 0) setRevsFoundReports(0);

            setAllReportProps(responedProps);
            setReportsProps(finalArrProps);
            setReportsRevs(finalArrRevs);
            setRevsFoundReports(finalArrRevs?.length);
            setFoundReports(count);
            setFetchingReports(false);
            
        } catch (err) {
            console.log(err.message);
            setFoundReports(0);
            setRevsFoundReports(0);
            setFetchingReports(false);
        }

    };

    const fetchProps = async() => {

        try {


            if(fetchingProps) return;

            setFetchingProps(true);

            const res = await getAdminProps(sectionType?.split(' ')?.at(1), propsSkip);

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

            const res = await getUsersAdmin(sectionType?.split(' ')?.at(1), usersSkip);

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

        console.log('fetch files');

        if(fetchingFiles) return;

        try {

            setFetchingFiles(true);

            const res = await getFiles(storageKey, userEmail);

            console.log('fetch files res: ', res);

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

    const fetchErrors = async(skipCount) => {

        try {

            if(fetchingErrors) return;

            setFetchingErrors(true);

            const res = await getAdminErrors(errorsFilter.value, skipCount || 0, cardsPerPage);

            console.log(res);

            if(res.success !== true) {
                setErrors([]);
                setFetchingErrors(false);
                setFoundErros(0);
                return;
            };

            setErrors(res.dt);
            setFoundErros(res.count);
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

    const handleSectiontype = () => {
        switch (sectionType?.split(' ')?.at(0)) {
            case 'reports':
                if(sectionType?.split(' ')?.at(1) === 'errors')
                    return fetchErrors();
                return fetchReports();
            case 'properties':
                return fetchProps();
            case 'users':
                return fetchUsers();
            case 'files':
                if(sectionType?.split(' ')?.at(1) === 'all-files')
                    return fetchFiles();
                return;
        }
    };

    useEffect(() => {
        handleSectiontype();
    }, [sectionType]);

    useEffect(() => {
        let timeout;
        if(loadingUserInfo === false) 
            timeout = setTimeout(() => setFetchingUserInfo(false), 10000);
        return () => clearTimeout(timeout);
    }, [loadingUserInfo]);

    useEffect(() => {
        if(loadingUserInfo === false && userId?.length > 0 && (userRole !== 'admin' || userRole === 'owner')) 
            setFetchingUserInfo(false);
    }, [userId, userRole]);

    useEffect(() => {
        if(sectionType === 'files all-files') fetchFiles();
    }, [storageKey]);

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
    };

    const SideNavOptions = () => {

        const XX = ({
            options
        }) => { 
            return <ul className='side-nav-options-ul'>
                {options?.map((op) => (
                    <li onClick={op.handleClick} 
                        className={sectionType?.split(' ')?.at(1) === (op.nameId) 
                        ? 'side-nav-option-li-selected' : ''}>{op.name}</li>
                ))}
            </ul>
        };

        const reportsSections = [
            {nameId: 'props', handleClick: () => setSectionType('reports props'), name: 'ابلاغات عن اعلانات'},
            {nameId: 'reviews', handleClick: () => setSectionType('reports reviews'), name: 'ابلاغات عن مراجعات'},
            {nameId: 'errors', handleClick: () => setSectionType('reports errors'), name: 'الأخطاء و المشاكل'},
        ];

        const usersSection = [
            { nameId: 'all-users', handleClick: () => setSectionType('users all-users'), name: 'كل المستخدمين' },
            { nameId: 'Host_requests', handleClick: () => setSectionType('users Host_requests'), name: 'طلبات تحويل الى معلن' },
            { nameId: 'blocked-true', handleClick: () => setSectionType('users blocked-true'), name: 'محظور' },
            { nameId: 'blocked-false', handleClick: () => setSectionType('users blocked-false'), name: 'غير محظور' },
            { nameId: 'email_verified-true', handleClick: () => setSectionType('users email_verified-true'), name: 'مفعل الحساب' },
            { nameId: 'email_verified-false', handleClick: () => setSectionType('users email_verified-false'), name: 'غير مفعل للحساب' },
            { nameId: 'user', handleClick: () => setSectionType('users user'), name: 'مستخدم عادي' },
            { nameId: 'admin', handleClick: () => setSectionType('users admin'), name: 'مسؤول' },
            { nameId: 'owner', handleClick: () => setSectionType('users owner'), name: 'مالك' },
            { nameId: 'find-by-email', handleClick: () => setSectionType('users find-by-email'), name: 'ايجاد مستخدم بالايميل ' },
        ];

        const propsSections = [
            { nameId: 'check-properties', handleClick: () => setSectionType('properties check-properties'), name: 'اعلانات غير مقبولة' },
            { nameId: 'hidden-properties', handleClick: () => setSectionType('properties hidden-properties'), name: 'اعلانات مخفية' },
            { nameId: 'properties-by-files', handleClick: () => setSectionType('properties properties-by-files'), name: 'اعلانات حسب حجم الملفات' },
        ];

        const filesSections = [
            { nameId: 'all-files', handleClick: () => setSectionType('files all-files'), name: 'الملفات المرفوعة' },
            { nameId: 'delete', handleClick: () => setSectionType('files delete'), name: 'حذف ملف' }
        ];

        switch (sectionType?.split(' ')[0]) {
            case 'reports':
                return <XX options={reportsSections}/>
            case 'users':
                return <XX options={usersSection}/>
            case 'properties':
                return <XX options={propsSections}/>
            case 'files':
                return <XX options={filesSections}/>
        }

    };

  return (

    <div className='admin-wrapper'>

        <div className='admin-header'>
            <div className='menu-icon' onClick={() => {
                setIsSideNav(!isSideNav)
            }}>
                <span/>
                <span/>
                <span style={{ marginBottom: 0 }}/>
            </div>
        </div>

        <motion.div className='admin-side-nav'
            initial={{
                right: isMobile960 ? '-300px' : 0
            }}
            animate={{
                right: (!isMobile960 || isSideNav) ? 0 : '-300px'
            }}
        >
                <h2>صفحة الادارة</h2>
                <ul className='side-nav-ul'>
                    <li onClick={() => setSectionType('notif')} className={'side-nav-ul-li' + (sectionType?.split(' ')?.at(0) === 'notif' ? ' side-nav-li-selected' : '')}><Svgs name={'report'}/> الاشعارات</li>
                    
                    <li onClick={() => setSectionType('reports props')} className={'side-nav-ul-li' + (sectionType?.split(' ')?.at(0) === 'reports' ? ' side-nav-li-selected' : '')}><span /><Svgs name={'report'}/> الابلاغات</li>
                    {sectionType?.split(' ')?.at(0) === 'reports' && <SideNavOptions />}

                    <li onClick={() => setSectionType('properties check-properties')} className={'side-nav-ul-li' + (sectionType?.split(' ')?.at(0) === 'properties' ? ' side-nav-li-selected' : '')}><span /><Svgs name={'advertise'}/> اعلانات بانتظار مراجعتها</li>
                    {sectionType?.split(' ')?.at(0) === 'properties' && <SideNavOptions />}

                    <li onClick={() => setSectionType('users all-users')} className={'side-nav-ul-li' + (sectionType?.split(' ')?.at(0) === 'users' ? ' side-nav-li-selected' : '')}><span /><Svgs name={'profile'}/> قائمة المستخدمين</li>
                    {sectionType?.split(' ')?.at(0) === 'users' && <SideNavOptions />}

                    <li onClick={() => setSectionType('files all-files')} className={'side-nav-ul-li' + (sectionType?.split(' ')?.at(0) === 'files' ? ' side-nav-li-selected' : '')}><span /><Svgs name={'layer'}/> الملفات</li>
                    {sectionType?.split(' ')?.at(0) === 'files' && <SideNavOptions />}
                </ul>
        </motion.div>

        <div className='admin-content'>

            <div style={{ display: sectionType?.split(' ')?.at(0) !== 'properties' ? 'none' : undefined }}>
                <PropertiesArray type={'admin-properties'} adminSectionType={sectionType} isEdit cardsPerPage={cardsPerPage}/>
            </div>

            <div className='notifications' style={{ display: sectionType?.split(' ')?.at(0) !== 'notif' ? 'none' : undefined }}>
                <Notif isAdmin adminSectionType={sectionType}/>
            </div>

            <div style={{ 
                display: sectionType !== 'reports props' ? 'none' : undefined 
            }}>
                <AdminPart trigger={() => setIsReportsRevs(false)} title={'Reports'} isFetching={fetchingReports} type={'reports'} array={reportsProps} isShow={isReportsProps} setIsShow={setIsReportsProps} skip={reportPropsSkip} setSkip={setReportPropsSkip} fetchArr={fetchReports}
                    cardsPerPage={cardsPerPage}foundItems={foundReports}/>
            </div>

            <div style={{ 
                display: sectionType !== 'reports reviews' ? 'none' : undefined 
            }}>
                <AdminPart trigger={() => setIsReportsProps(false)} title={'الإِبلاغات عن مراجعات'} isFetching={fetchingReports} type={'reviews'} array={reportsRevs} isShow={isReportsRevs} setIsShow={setIsReportsRevs} skip={reportRevsSkip} setSkip={setReportRevsSkip} handleReviewNav={navigateToViewFromReview}
                fetchArr={fetchReports}
                cardsPerPage={cardsPerPage} foundItems={foundRevsReports}/>
            </div>

            <div style={{ 
                display: sectionType !== 'reports errors' ? 'none' : undefined 
            }}>
                <AdminPart isEnglish={false} title={'الأخطاء و المشاكل'} isFetching={fetchingErrors} type={'users'} array={errors} removeFromList={removeFromList}isShow={isErrors} setIsShow={setIsErrors} skip={errorsSkip} setSkip={setErrorsSkip} isPartFilter={isErrorsFilterDiv} setIsPartFilter={setIsErrorsFilterDiv} selected={errorsFilter}setSelected={setErrorsFilter} filterArray={errorsSection} isFilter={true}
                fetchArr={fetchErrors}
                cardsPerPage={cardsPerPage} foundItems={foundErrors}/>
            </div>
            
            <div className='find-user-by-email' style={{
                display: sectionType?.split(' ')?.at(1) !== 'find-by-email' ? 'none' : undefined
            }}>
                
                <CustomInputDiv title={'ادخل بريد المستخدم'} isError={userFindError.length > 0} errorText={userFindError === '-1' ? 'ايميل غير صالح' : ''} value={userFindEmail} listener={(e) => setUserFindEmail(e.target.value)} type={'text'}/>
            
                <button className='btnbackscndclr' onClick={findUserByEmail}>{findingUser ? <LoadingCircle /> : 'البحث'}</button>

                <p>{userFindError === '-1' ? '' : userFindError}</p>

                <UserDiv isShow={userByEmailItem?._id ? true : false} item={userByEmailItem}/>

            </div>

            <div style={{
                display: 
                    (sectionType?.split(' ')?.at(0) !== 'users' 
                    || sectionType?.split(' ')?.at(1) === 'find-by-email')
                    ? 'none' : undefined  
            }}>
                <AdminPart title={'مستخدمين المنصة'} isFetching={fetchingUsers} type={'users'} array={users} 
                isShow={isUsers} setIsShow={setIsUsers} skip={usersSkip} setSkip={setUsersSkip}
                isFilter={true} filterArray={usersSections} isPartFilter={isUsersFilterDiv}
                setIsPartFilter={setIsUsersFilterDiv} selected={userFilter} 
                setSelected={setUserFilter}/>
            </div> 

            <div className='files-uploaded' style={{
                display:
                    (sectionType?.split(' ')?.at(0) !== 'files' 
                        || sectionType?.split(' ')?.at(1) !== 'all-files')
                        ? 'none' : undefined  
            }}>
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
                            <label>{file}</label>
                            <button className='btnbackscndclr' onClick={() => deleteThisFile(file)}>{deleteingFile === file ?<LoadingCircle /> : 'حذف'}</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='find-user-by-email' style={{
                display:
                (sectionType?.split(' ')?.at(0) !== 'files' 
                        || sectionType?.split(' ')?.at(1) === 'all-files')
                        ? 'none' : undefined  
            }}>

                <CustomInputDiv title={'ادخل اسم الملف'} isError={filename === '-1'} errorText={'اسم ملف غير صالح'} value={filename} listener={(e) => setFilename(e.target.value)}/>
            
                <button className='btnbackscndclr' onClick={deleteFileByName}>{deletingSpecificFile ? <LoadingCircle /> : 'حذف الملف'}</button>

                <p id={fileDeleteError?.length > 0 ? 'p-info-error' : 'p-info'}>{fileDeleteError?.length > 0 ? fileDeleteError : fileDeleteSuccess}</p>

            </div>

        </div>

        {isSideNav && <span 
        id='closePopups' onClick={() => setIsSideNav(false)}/>}

    </div>
  )
};

export default page;
