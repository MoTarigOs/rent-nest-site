'use client';

import '../../admin/Admin.scss';
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

    const cardsPerPage = 36;

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

            const res = await getUserByEmailAdmin(userFindEmail, true);

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

            const res = await deleteSpecificFile(storageKey, userEmail, filename, true);

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
                        location.href = `/en/view/${allReportProps[i].title.replaceAll(' ', '-')}?id=${allReportProps[i]._id}`
                    }
                }
            }
        }
    };

    if(!userId?.length > 0 || (userRole !== 'admin' && userRole !== 'owner')){
        return (
            fetchingUserInfo ? <MySkeleton isMobileHeader/> : <NotFound type={'not allowed'} isEnglish/>
        )
    }

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
            {nameId: 'props', handleClick: () => setSectionType('reports props'), name: 'Units Reports'},
            {nameId: 'reviews', handleClick: () => setSectionType('reports reviews'), name: 'Reviews Reports'},
            {nameId: 'errors', handleClick: () => setSectionType('reports errors'), name: 'Errors & Issues'},
        ];

        const usersSection = [
            { nameId: 'all-users', handleClick: () => setSectionType('users all-users'), name: 'All Users' },
            { nameId: 'Host_requests', handleClick: () => setSectionType('users Host_requests'), name: 'Requests for Being Host' },
            { nameId: 'blocked-true', handleClick: () => setSectionType('users blocked-true'), name: 'Blocked Users' },
            { nameId: 'blocked-false', handleClick: () => setSectionType('users blocked-false'), name: 'Not Blocked Users' },
            { nameId: 'email_verified-true', handleClick: () => setSectionType('users email_verified-true'), name: 'Activated Accounts' },
            { nameId: 'email_verified-false', handleClick: () => setSectionType('users email_verified-false'), name: 'Un-Activated Accounts' },
            { nameId: 'user', handleClick: () => setSectionType('users user'), name: 'Normal Users' },
            { nameId: 'admin', handleClick: () => setSectionType('users admin'), name: 'Admins' },
            { nameId: 'owner', handleClick: () => setSectionType('users owner'), name: 'Owners' },
            { nameId: 'find-by-email', handleClick: () => setSectionType('users find-by-email'), name: 'Find User By Emai' },
        ];

        const propsSections = [
            { nameId: 'check-properties', handleClick: () => setSectionType('properties check-properties'), name: 'Waiting to Approve' },
            { nameId: 'hidden-properties', handleClick: () => setSectionType('properties hidden-properties'), name: 'Hidden Units' },
            { nameId: 'properties-by-files', handleClick: () => setSectionType('properties properties-by-files'), name: 'Units by Files Size' },
        ];

        const filesSections = [
            { nameId: 'all-files', handleClick: () => setSectionType('files all-files'), name: 'Uploaded Files' },
            { nameId: 'delete', handleClick: () => setSectionType('files delete'), name: 'Delete File' }
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

    <div className='admin-wrapper' dir='ltr'>

        <div className='admin-header'>
            <div className='menu-icon' onClick={() => {
                if(isMobile960) setIsSideNav(!isSideNav)
            }}>
                <span/>
                <span/>
                <span style={{ marginBottom: 0 }}/>
            </div>
        </div>

        <motion.div className='admin-side-nav'
            initial={{
                left: isMobile960 ? '-300px' : 0
            }}
            animate={{
                left: (!isMobile960 || isSideNav) ? 0 : '-300px'
            }}
        >
                <h2>Admin Dashboard</h2>
                <ul className='side-nav-ul'>

                    <li onClick={() => setSectionType('notif')} className={'side-nav-ul-li' + (sectionType?.split(' ')?.at(0) === 'notif' ? ' side-nav-li-selected' : '')}><Svgs name={'report'}/> Notifications</li>
                    
                    <li onClick={() => setSectionType('reports props')} className={'side-nav-ul-li' + (sectionType?.split(' ')?.at(0) === 'reports' ? ' side-nav-li-selected' : '')}><span /><Svgs name={'report'}/> Reports</li>
                    {sectionType?.split(' ')?.at(0) === 'reports' && <SideNavOptions />}

                    <li onClick={() => setSectionType('properties check-properties')} className={'side-nav-ul-li' + (sectionType?.split(' ')?.at(0) === 'properties' ? ' side-nav-li-selected' : '')}><span /><Svgs name={'advertise'}/> Units to Review</li>
                    {sectionType?.split(' ')?.at(0) === 'properties' && <SideNavOptions />}

                    <li onClick={() => setSectionType('users all-users')} className={'side-nav-ul-li' + (sectionType?.split(' ')?.at(0) === 'users' ? ' side-nav-li-selected' : '')}><span /><Svgs name={'profile'}/> Users Menu</li>
                    {sectionType?.split(' ')?.at(0) === 'users' && <SideNavOptions />}

                    <li onClick={() => setSectionType('files all-files')} className={'side-nav-ul-li' + (sectionType?.split(' ')?.at(0) === 'files' ? ' side-nav-li-selected' : '')}><span /><Svgs name={'layer'}/> Files</li>
                    {sectionType?.split(' ')?.at(0) === 'files' && <SideNavOptions />}

                </ul>
        </motion.div>

        <div className='admin-content'>

            <div style={{ display: sectionType?.split(' ')?.at(0) !== 'properties' ? 'none' : undefined }}>
                <PropertiesArray isEnglish type={'admin-properties'} adminSectionType={sectionType} isEdit cardsPerPage={cardsPerPage}/>
            </div>

            <div className='notifications' style={{ display: sectionType?.split(' ')?.at(0) !== 'notif' ? 'none' : undefined }}>
                <Notif isEnglish isAdmin adminSectionType={sectionType}/>
            </div>

            <div style={{ 
                display: sectionType !== 'reports props' ? 'none' : undefined 
            }}>
                <AdminPart trigger={() => setIsReportsRevs(false)} title={'Units Reports'} isFetching={fetchingReports} type={'reports'} array={reportsProps} isShow={isReportsProps} setIsShow={setIsReportsProps} skip={reportPropsSkip} setSkip={setReportPropsSkip} fetchArr={fetchReports}
                    cardsPerPage={cardsPerPage}foundItems={foundReports} isEnglish/>
            </div>

            <div style={{ 
                display: sectionType !== 'reports reviews' ? 'none' : undefined 
            }}>
                <AdminPart trigger={() => setIsReportsProps(false)} title={'Reviews Reports'} isFetching={fetchingReports} type={'reviews'} array={reportsRevs} isShow={isReportsRevs} setIsShow={setIsReportsRevs} skip={reportRevsSkip} setSkip={setReportRevsSkip} handleReviewNav={navigateToViewFromReview}
                fetchArr={fetchReports}
                cardsPerPage={cardsPerPage} foundItems={foundRevsReports} isEnglish/>
            </div>

            <div style={{ 
                display: sectionType !== 'reports errors' ? 'none' : undefined 
            }}>
                <AdminPart isEnglish={true} title={'Errors & Issues'} isFetching={fetchingErrors} type={'users'} array={errors} removeFromList={removeFromList}isShow={isErrors} setIsShow={setIsErrors} skip={errorsSkip} setSkip={setErrorsSkip} isPartFilter={isErrorsFilterDiv} setIsPartFilter={setIsErrorsFilterDiv} selected={errorsFilter}setSelected={setErrorsFilter} filterArray={errorsSection} isFilter={true}
                fetchArr={fetchErrors}
                cardsPerPage={cardsPerPage} foundItems={foundErrors}/>
            </div>
            
            <div className='find-user-by-email' style={{
                display: sectionType?.split(' ')?.at(1) !== 'find-by-email' ? 'none' : undefined
            }}>
                
                <CustomInputDiv title={'Enter User Email'} isError={userFindError.length > 0} errorText={userFindError === '-1' ? 'Invalid Email' : ''} value={userFindEmail} listener={(e) => setUserFindEmail(e.target.value)} type={'text'}/>
            
                <button className='btnbackscndclr' onClick={findUserByEmail}>{findingUser ? <LoadingCircle /> : 'Search'}</button>

                <p>{userFindError === '-1' ? '' : userFindError}</p>

                <UserDiv isEnglish isShow={userByEmailItem?._id ? true : false} item={userByEmailItem}/>

            </div>

            <div style={{
                display: 
                    (sectionType?.split(' ')?.at(0) !== 'users' 
                    || sectionType?.split(' ')?.at(1) === 'find-by-email')
                    ? 'none' : undefined  
            }}>
                <AdminPart title={'Users'} isFetching={fetchingUsers} type={'users'} array={users} 
                isShow={isUsers} setIsShow={setIsUsers} skip={usersSkip} setSkip={setUsersSkip}
                isFilter={true} filterArray={usersSections} isPartFilter={isUsersFilterDiv}
                setIsPartFilter={setIsUsersFilterDiv} selected={userFilter} 
                setSelected={setUserFilter} isEnglish/>
            </div> 

            <div className='files-uploaded' style={{
                display:
                    (sectionType?.split(' ')?.at(0) !== 'files' 
                        || sectionType?.split(' ')?.at(1) !== 'all-files')
                        ? 'none' : undefined  
            }}>
                <button className='filter-btn'>
                    Total Files Size <span>{fetchingFiles ? 'Calculating...' : storageSize}</span>
                </button>
                <ul>  
                    {(!files?.length > 0 && fetchingFiles) &&
                        <Skeleton height={299} width={299}/>    
                    }
                    {files.map((file, index) => (
                        <li key={index}>
                            {getExtension(file) === 'img' ? 
                            <Image width={299} height={299} src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${file}`}/>
                            : getExtension(file) === 'video' && <video width={299} height={299} controls autoPlay loop src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${file}`}/>}
                            <label>{file}</label>
                            <button className='btnbackscndclr' onClick={() => deleteThisFile(file)}>{deleteingFile === file ?<LoadingCircle /> : 'Delete'}</button>
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

                <CustomInputDiv title={'Enter File name'} isError={filename === '-1'} errorText={'Invalid Filename'} value={filename} listener={(e) => setFilename(e.target.value)}/>
            
                <button className='btnbackscndclr' onClick={deleteFileByName}>{deletingSpecificFile ? <LoadingCircle /> : 'Delete the File'}</button>

                <p id={fileDeleteError?.length > 0 ? 'p-info-error' : 'p-info'}>{fileDeleteError?.length > 0 ? fileDeleteError : fileDeleteSuccess}</p>

            </div>

        </div>

        {isSideNav && <span 
        id='closePopups' onClick={() => setIsSideNav(false)}/>}

    </div>
  )
};

export default page;
