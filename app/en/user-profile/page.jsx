'use client';

import { useSearchParams } from 'next/navigation';
import '../../profile/Profile.scss';
import Svgs from '@utils/Svgs';
import { Suspense, useContext, useEffect, useRef, useState } from 'react';
import Card from '@components/Card';
import InfoDiv from '@components/InfoDiv';
import { blockDurationsArray, getDurationReadable, getReadableDate, getRoleArabicName } from '@utils/Logic';
import HeaderPopup from '@components/popups/HeaderPopup';
import { Context } from '@utils/Context';
import CustomInputDiv from '@components/CustomInputDiv';
import { blockUser, deleteAccountAdmin, deleteUserAccountFilesAdmin, getOwnerProperties, getUserByEmailAdmin, getUserByIdAdmin, handlePromotion, sendCode, unBlockUser } from '@utils/api';
import MySkeleton from '@components/MySkeleton';
import NotFound from '@components/NotFound';
import Skeleton from 'react-loading-skeleton';

const Page = () => {

    const id = useSearchParams().get('id');
    const username = useSearchParams().get('username');
    const email = useSearchParams().get('email');

    const { userEmail, userRole, storageKey, isVerified } = useContext(Context);

    const [user, setUser] = useState(null);

    const [runOnce, setRunOnce] = useState(false);
    const [fetchingUserInfo, setFetchingUserInfo] = useState(true);
    const [isHisProps, setIsHisProps] = useState(false);
    const [fetchingProps, setFetchingProps] = useState(false);
    const [props, setProps] = useState([]);

    const [isBlock, setIsBlock] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const [blockError, setBlockError] = useState('');
    const [blockSuccess, setBlockSuccess] = useState('');
    const [blockReason, setBlockReason] = useState('');
    const [isBlockDuration, setIsBlockDuration] = useState(false);
    const [blockDurationObj, setBlockDurationObj] = useState(blockDurationsArray[0]);

    const [code, setCode] = useState('');
    const [sendingCode, setSendingCode] = useState(false);
    const [sendCodeError, setSendCodeError] = useState('');
    const [sendCodeSuccess, setSendCodeSuccess] = useState('');
    const [isSentCodeEmail, setIsSentCodeEmail] = useState(false);

    const [isPromoteDiv, setIsPromoteDiv] = useState(false);
    const [promoting, setPromoting] = useState(false);
    const [promoteError, setPromoteError] = useState('');
    const [promoteSuccess, setPromoteSuccess] = useState('');

    const [isDeleteAccountDiv, setIsDeleteAccountDiv] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [deleteAccountError, setDeleteAccountError] = useState('');
    const [deleteAccountSuccess, setDeleteAccountSuccess] = useState('');

    const [isConvertDiv, setIsConvertDiv] = useState(false);
    const [convertingToHost, setConvertingToHost] = useState(false);
    const [convertError, setConvertError] = useState('');
    const [convertSuccess, setConvertSuccess] = useState('');

    const fetchUserDetails = async() => {

      try {
        const res = id 
          ? await getUserByIdAdmin(id)
          : await getUserByEmailAdmin(email);

        if(res.success === true) {
          setUser(res.dt);
          setFetchingUserInfo(false);
          return;
        }
        setFetchingUserInfo(false);
      } catch (err) {
        console.log(err.message);
        setFetchingUserInfo(false);
      }

    };

    const fetchProps = async() => {

      try {
        
        setFetchingProps(true);

        const res = await getOwnerProperties(id);

        if(res.success !== true){
          setFetchingProps(false);
          return;
        }

        setProps(res.dt);
        setFetchingProps(false);

      } catch (err) {
        console.log(err.message);
        setFetchingProps(false);
      }

    };

    const sendCodeToEmail = async() => {

        try {
  
          setSendingCode(true);
  
          const res = await sendCode(null, true);
  
          if(res.success !== true) {
            setSendCodeError(res.dt);
            setSendingCode(false);
            setSendCodeSuccess('');
            setIsSentCodeEmail(false);
            return;
          };
  
          setSendCodeError('');
          setSendCodeSuccess('A code has been sent to your email');
          setIsSentCodeEmail(true);
          setSendingCode(false);
          
        } catch (err) {
          console.log(err.message);
          setSendCodeError('An unknown error has occurred');
          setSendCodeSuccess('');
          setIsSentCodeEmail(false);
          setSendingCode(false);
        }
  
    };

    const handleBlockUser = async() => {

        try {

            if(blocking) return;

            if(!user.isBlocked && (!blockDurationObj?.value
              || blockDurationObj.ms <= 0)){
              setBlockError('Please specify a duration and reason for the ban.');
              setBlockSuccess('');
              return;
            };

            if(!user.isBlocked && (!blockReason?.length 
              || blockReason.length <= 0 || blockReason === '-1')){
              setBlockError('');
              setBlockReason('-1');
              setBlockSuccess('');
              return;
            };

            setBlocking(true);

            let res = null;

            if(user.isBlocked){
                res = await unBlockUser(id, true);
            } else {
                res = await blockUser(id, blockDurationObj, blockReason, true);
            }

            if(res.success !== true){
                setBlockError(res.dt);
                setBlockSuccess('');
                setBlocking(false);
                return;
            }

            setBlockError('');
            setBlockSuccess(user.isBlocked ? 'The ban has been successfully unblocked' : 'Blocked successfully')
            setUser(res.dt);
            setBlocking(false);
            
        } catch (err) {
            console.log(err.message);
            setBlockError('Something went wrong');
            setBlockSuccess('');
            setBlocking(false);
        }

    };

    const promoteAdmin = async() => {

      try {

        if(promoting || !isNormalUser()) return;

        if(!isSentCodeEmail || !code || code.length !== 6){
          setPromoteError('Please write the code sent to your email.');
          setPromoteSuccess('');
          return;
        }

        if(!user.email_verified){
          setPromoteError('This user has not verified his account.');
          setPromoteSuccess('');
          return;
        }

        if(user.isBlocked){
          setPromoteError('This user is banned.');
          setPromoteSuccess('');
          return;
        }

        setPromoting(true);

        const res = await handlePromotion('promote-to-admin', id, code, true);

        if(res.success !== true){
          setPromoteError(res.dt);
          setPromoteSuccess('');
          setPromoting(false);
          return;
        }

        setPromoteError('');
        setPromoteSuccess('Promote successfully.');
        setUser(res.dt);
        setPromoting(false);
        
      } catch (err) {
        console.log(err.message);
        setPromoteError('Something went wrong');
        setPromoteSuccess('');
        setPromoting(false);
      }

    };

    const demoteAdmin = async() => {

      try {

        if(promoting || isNormalUser()) return;

        if(!isSentCodeEmail || !code || code.length !== 6){
          setPromoteError('Please write the code sent to your email.');
          setPromoteSuccess('');
          return;
        }

        setPromoting(true);

        const res = await handlePromotion('demote-from-admin', id, code, true);

        if(res.success !== true){
          setPromoteError(res.dt);
          setPromoteSuccess('');
          setPromoting(false);
          return;
        }

        setPromoteError('');
        setPromoteSuccess('Upgrade completed successfully.');
        setUser(res.dt);
        setPromoting(false);
        
      } catch (err) {
        console.log(err.message);
        setPromoteError('Something went wrong');
        setPromoteSuccess('');
        setPromoting(false);
      }

    };

    const deleteAccount = async() => {

      // if this user is admin, demote him to user then delete

      if(deletingAccount) return;

      if(user.role === 'admin'){
        setDeleteAccountError('This account belongs to an administrator. To delete his account, please demote his rank to user.');
        setDeleteAccountSuccess('');
        return;
      }

      if(!isSentCodeEmail){
        setDeleteAccountError('Please send the code to your email first.');
        setDeleteAccountSuccess('');
        return;
      }

      if(!isSentCodeEmail || !code || code.length !== 6){
        setDeleteAccountError('Please enter the code sent to your email.');
        setDeleteAccountSuccess('');
        return;
      }

      setDeletingAccount(true);

      try {

        const deleteFilesRes = await deleteUserAccountFilesAdmin(
          id, code, storageKey, userEmail, true
        );

        if(deleteFilesRes.success !== true){
          setDeleteAccountError(deleteFilesRes.dt);
          setDeleteAccountSuccess('');
          setDeletingAccount(false);
          return;
        }

        const res = await deleteAccountAdmin(id, code, email);

        if(res.success !== true){
          setDeleteAccountError(res.dt);
          setDeleteAccountSuccess('');
          setDeletingAccount(false);
          return;
        };

        setDeleteAccountError('');
        setDeleteAccountSuccess('The user account has been successfully deleted');
        
      } catch (err) {
        console.log(err.message);
        setDeleteAccountError('Something went wrong');
        setDeleteAccountSuccess('');
        setDeletingAccount(false);
      }

    };

    const convertUserToHost = async() => {

      try {
          setConvertingToHost(true);
          const res = await convertToBeHost(user._id);
          if(!res || res.ok !== true) {
            setConvertError('حدث خطأ ما أثناء العملية.');
            setConvertSuccess('');
            setConvertingToHost(false);
            return;
          }
          setConvertError('');
          setConvertSuccess('تم تحويل المستخدم الى معلن.');
          setConvertingToHost(false);
      } catch (err) {
          console.log(err);
          setConvertingToHost(false);
      }

    };

    const isNormalUser = () => {
      if(user.role === 'admin') return false;
      if(user.role === 'owner') return false;
      return true;
    };

    useEffect(() => {
      setRunOnce(true);
    }, []);

    useEffect(() => {
      if(runOnce === true) fetchUserDetails();
    }, [runOnce]);

    useEffect(() => {
      if(isHisProps) fetchProps();
    }, [isHisProps]);

    if(!user || !isVerified){
      return (
        fetchingUserInfo ? <MySkeleton isMobileHeader/> : <NotFound isEnglish type={!isVerified ? 'not allowed' : undefined}/>
      )
    };

  return (
    <div className='profile user-profile' dir='ltr'>

        {user.ask_convert_to_host && user.account_type !== 'host' && <div className='convert-to-host-div disable-text-copy' style={{ display: !isConvertDiv ? 'none' : undefined }}>
          <span id='close-span' onClick={() => setIsConvertDiv(false)}/>
          <div className='convertDiv'>
            <h3>Are you sure to convert this user's account into an advertiser on the platform?</h3>
            <div className='btns'>
              <button className='btnbackscndclr' onClick={convertUserToHost} style={convertSuccess?.length > 0 ? { background: 'var(--darkWhite)', color: '#767676' } : null}>{convertingToHost ? <LoadingCircle /> : (convertSuccess?.length > 0 ? 'Convert Done' : 'Convert')}</button>
              <button className='btnbackscndclr' onClick={() => setIsConvertDiv(false)} style={{ background: 'var(--darkWhite)', color: '#767676' }}>Cancel</button>
            </div>
            <p style={{ display: convertingToHost ? 'none' : undefined }} id={convertError?.length > 0 ? 'p-info-error' : 'p-info'}>{convertError?.length > 0 ? convertError : convertSuccess }</p>
          </div>
        </div>}

        <div className='profileDetails'>
            
            <h2>{!isNormalUser() ? (user.role === 'admin' ? 'Admin' : 'Owner'): 'User'} <span>{user?.firstNameEN || user?.lastNameEN || user?.username}</span></h2>

            {user.ask_convert_to_host && user.account_type !== 'host' 
              && <div className='askForHost'>
              <h3>This user requested to be converted into an advertiser on the platform {'(Contact him via number or email to find out more details about him, then convert him to an advertiser via the “Convert” button.)'}</h3>
              <button className='btnbackscndclr' onClick={() => setIsConvertDiv(true)}>Convert</button>  
            </div>}

            <InfoDiv title={'Username'} value={username}/>

            <InfoDiv title={'Role'} value={user.role}/>

            <InfoDiv title={'Email'} isInfo={user?.email_verified ? false : true} 
                info={'This user has not verified his account'} value={email} type={'email'}/>

            <InfoDiv title={'Phone number'} value={user?.phone ? user.phone : ''}/>
            
            <InfoDiv title={'User Address'} value={user?.addressEN || user?.address}/>
            
            <hr />

            <button className={isHisProps ? 'editDiv chngpassbtn' : 'editDiv'} onClick={() => setIsHisProps(!isHisProps)}>User Offers <Svgs name={'dropdown arrow'}/></button>

            <div className='items'> 
              <ul style={{ display: !isHisProps ? 'none' : null }}>
                {(!props.length > 0) ? <li className="empty-holder">
                      {fetchingProps ? <div><Skeleton width={'100%'} height={'100%'}/></div> : <NotFound isEnglish/>}
                </li> : props.map((item, index) => (
                      <li key={index}><Card item={item} isEnglish={true}/></li>
                  ))}
              </ul>
            </div>

            <hr />

            <button onClick={() => setIsBlock(!isBlock)} className={isBlock ? 'editDiv chngpassbtn' : 'editDiv'}>Block Status <Svgs name={'dropdown arrow'}/></button>

            {(isNormalUser() || (!isNormalUser() && userRole === 'owner')) && <div className='block-user' style={{ display: !isBlock ? 'none' : null }}>

                {!user.isBlocked ? <>

                    <div id='select-duration' onClick={() => setIsBlockDuration(!isBlockDuration)}>Block Duration <span>{blockDurationObj.value}</span></div>

                    <HeaderPopup type={'custom'} isEnglish customArray={blockDurationsArray} 
                    selectedCustom={blockDurationObj} setSelectedCustom={setBlockDurationObj} isCustom={isBlockDuration} setIsCustom={setIsBlockDuration}/>

                    <CustomInputDiv title={'Block Reason'} isError={blockReason === '-1'} errorText={'Please write a reason for blocking this account.'} value={blockReason === '-1' ? '' : blockReason} listener={(e) => setBlockReason(e.target.value)}/>

                    <button className='btnbackscndclr' onClick={handleBlockUser}>
                        {blocking ? 'Blocking...' : 'Block User'}</button>
                    
                    </> : <>
                    
                    <InfoDiv value={getReadableDate(new Date(user.blocked.date_of_block))} title={'Block date'}/>

                    <InfoDiv title={'Block Duration'} value={getDurationReadable(user.blocked.block_duration - (Date.now() - user.blocked.date_of_block))}/>

                    <InfoDiv title={'Block Reason'} value={user.blocked.reason}/>

                    <button className='btnbackscndclr' onClick={handleBlockUser}>
                        {blocking ? 'UnBlocking...' : 'UnBlock'}</button>

                </>}

                <p style={{ 
                    color: blockError?.length > 0 ? 'var(--softRed)' : null, 
                    display: (!blockError?.length > 0 && !blockSuccess?.length > 0) 
                        ? 'block' : null 
                    }}>
                    {blockError?.length > 0 ? blockError : blockSuccess}
                </p>

            </div>}

            <hr />

            <div className='deleteAccountDiv' style={{ display: userRole === 'owner' ? null : 'none' }}>

              <button className={'editDiv'} 
              onClick={() => {
                setIsDeleteAccountDiv(false);
                setIsPromoteDiv(!isPromoteDiv);
              }}>
                {isNormalUser() ? 'Promote to Admin' : 'Demote'}<Svgs name={'dropdown arrow'}/>
              </button>

              <div className='verifyEmailDiv' style={{ display: !isPromoteDiv && 'none' }}>
                <p style={{ color: 'rgb(80, 80, 80)' }}>Before {isNormalUser() ? 'Promoting this user' : 'Demoting this user'}, please send a code to your email.</p>
                <button style={{ marginTop: 8 }} className='btnbackscndclr' onClick={() => sendCodeToEmail(null)}>{!sendingCode ? `Send code to ${userEmail}` : 'Sending...'}</button>
                <p id={sendCodeError?.length > 0 ? 'p-info-error' : 'p-info'}>{sendCodeError.length > 0 ? sendCodeError : sendCodeSuccess}</p>
                <CustomInputDiv title={'Enter Code'} listener={(e) => setCode(e.target.value)}/>
              </div>

              <div className='verifyEmailDiv' style={{ marginTop: -16, display: !isPromoteDiv && 'none' }}>

                  <p><Svgs name={'info'}/>Warning: This user will be promoted to the rank of administrator, and will have greater access to other users' accounts!</p>
     
                  <button style={{ marginTop: 12 }} className='btnbackscndclr' onClick={isNormalUser() ? promoteAdmin : demoteAdmin}>
                    {promoting ? (isNormalUser() ? 'Promoting...' : 'Demoting...') 
                    : (isNormalUser() ? 'Promote to Admin' : 'Demote to User')}
                  </button>
                  
                  <p id={promoteError?.length > 0 ? 'p-info-error' : 'p-info'}>
                      {promoteError.length > 0 ? promoteError : promoteSuccess}
                  </p>

              </div>
            </div>

            <hr />

            <div className='deleteAccountDiv'>

                <button className={isDeleteAccountDiv ? 'editDiv chngpassbtn' : 'editDiv'} 
                onClick={() => {
                  setIsPromoteDiv(false);
                  setIsDeleteAccountDiv(!isDeleteAccountDiv);
                }}>
                Delete user account<Svgs name={'dropdown arrow'}/>
                </button>

                <div className='verifyEmailDiv' style={{ display: !isDeleteAccountDiv && 'none' }}>
                  <p style={{ color: 'rgb(80, 80, 80)', marginBottom: 12 }}>Before deleting This account, please send the code to your email.</p>
                  <button style={{ marginTop: 8 }} className='btnbackscndclr' onClick={() => sendCodeToEmail(null)}>{!sendingCode ? `Send code to ${userEmail}` : 'Sending...'}</button>
                  <p id={sendCodeError?.length > 0 ? 'p-info-error' : 'p-info'} style={{ color: sendCodeError.length > 0 && 'var(--softRed)', marginBottom: 24 }}>{sendCodeError.length > 0 ? sendCodeError : sendCodeSuccess}</p>
                  <CustomInputDiv title={'Enter Code'} isError={deleteAccountError.length > 0} listener={(e) => setCode(e.target.value)}/>
                </div>

                <div className='verifyEmailDiv' style={{ display: !isDeleteAccountDiv && 'none', marginTop: -16 }}>
                
                    <p><Svgs name={'info'}/>Warning: The user account and everything related to it will be permanently deleted!</p>
                    
                    <button style={{ marginTop: 12 }} className='btnbackscndclr' onClick={deleteAccount}>{deletingAccount ? 'Deleting...' :'Delete Account permanently'}</button>
                    
                    <p id={deleteAccountError?.length > 0 ? 'p-info-error' : 'p-info'}>
                        {deleteAccountError.length > 0 ? deleteAccountError : deleteAccountSuccess}
                    </p>

                </div>
            </div>

        </div>

        <span style={{ display: !isBlockDuration ? 'none' : null }} onClick={() => {
            setIsBlockDuration(false);
        }} id='closePopubs'/>

    </div>
  )
}

const SuspenseWrapper = () => (
	<Suspense>
		<Page />
	</Suspense>
);

export default SuspenseWrapper;
