'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import '../../add/Add.css';
import CatagoryCard from '@components/CatagoryCard';
import Image from 'next/image';
import GoogleMapImage from '@assets/images/google-map-image.jpg';
import VehicleImage from '@assets/images/sedan-car.png';
import PropertyImage from '@assets/images/property.png';
import PropertyWhiteImage from '@assets/images/property-white.png';
import { JordanCities, ProperitiesCatagories, VehicleCatagories, contactsPlatforms, isInsideJordan } from '@utils/Data';
import CustomInputDiv from '@components/CustomInputDiv';
import { createProperty, uploadFiles } from '@utils/api';
import HeaderPopup from '@components/popups/HeaderPopup';
import { getNameByLang, getOptimizedAttachedFiles, isValidArrayOfStrings } from '@utils/Logic';
import { Context } from '@utils/Context';
import NotFound from '@components/NotFound';
import MySkeleton from '@components/MySkeleton';
import Svgs from '@utils/Svgs';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const page = () => {

    const { 
        userId, setIsMap, setMapType,
        latitude, setLatitude, storageKey,
        longitude, setLongitude, userEmail,
        loadingUserInfo, isVerified
    } = useContext(Context);

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/avi'];
    const inputFilesRef = useRef();
    const attachImagesDivRef = useRef();
    const [fetching, setFetching] = useState(true);

    const [selectedCatagories, setSelectedCatagories] = useState('1');
    const [error, setError] = useState('');
    const [cityPopup, setCityPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mapUsed, setMapUsed] = useState(false);

    const [specificCatagory, setSpecificCatagory] = useState('-1');
    const [itemTitle, setItemTitle] = useState('');
    const [itemDesc, setItemDesc] = useState('');
    const [itemCity, setItemCity] = useState({});
    const [area, setArea] = useState(0);
    const [itemNeighbour, setItemNeighbour] = useState('');
    const [itemPrice, setItemPrice] = useState(0);
    const [requireInsurance, setRequireInsurance] = useState(false);
    const [attachedFilesUrls, setAttachedFilesUrls] = useState([]);
    const [itemLong, setItemLong] = useState(null);
    const [itemLat, setItemLat] = useState(null);

    const [contacts, setContacts] = useState([]);
    const [contactsError, setContactsError] = useState('');

    const [guestRoomsDetailArray, setGuestRoomsDetailArray] = useState([]);
    const [companionsDetailArray, setCompanionsDetailArray] = useState([]);
    const [bathroomsDetailArray, setBathroomsDetailArray] = useState([]);
    const [kitchenDetailArray, setKitchenDetailArray] = useState([]);
    const [roomsDetailArray, setRoomsDetailArray] = useState([]);
    const [nearPlaces, setNearPlaces] = useState([]);
    const [conditionsAndTerms, setConditionsAndTerms] = useState([]);
    const [vehicleSpecifications, setVehicleSpecifications] = useState([]);
    const [vehicleFeatures, setVehicleFeatures] = useState([]);

    const { executeRecaptcha } = useGoogleReCaptcha();

    const getRecaptchaToken = async() => {
      if (!executeRecaptcha) return;
      const gReCaptchaToken = await executeRecaptcha('submit');
      console.log('recaptcha token: ', gReCaptchaToken);
      return gReCaptchaToken;
    };

    const details = [
        {name: 'Guest rooms', array: guestRoomsDetailArray, setArray: setGuestRoomsDetailArray},
        {name: 'Accompanying', array: companionsDetailArray, setArray: setCompanionsDetailArray},
        {name: 'Bathrooms', array: bathroomsDetailArray, setArray: setBathroomsDetailArray},
        {name: 'Kitchen', array: kitchenDetailArray, setArray: setKitchenDetailArray},
        {name: 'Rooms', array: roomsDetailArray, setArray: setRoomsDetailArray},
        {name: 'Near places', array: nearPlaces, setArray: setNearPlaces},
        {name: 'Book Terms & Conditions', array: conditionsAndTerms, setArray: setConditionsAndTerms},
    ];

    const vehiclesDetails = [
        {name: 'Car specifications', array: vehicleSpecifications, setArray: setVehicleSpecifications},
        {name: 'Additional benefits', array: vehicleFeatures, setArray: setVehicleFeatures},
        {name: 'Near places', array: nearPlaces, setArray: setNearPlaces},
        {name: 'Book Terms & Conditions', array: conditionsAndTerms, setArray: setConditionsAndTerms},
    ];

    const getDetails = () => {
        if(selectedCatagories === '0'){
            return vehiclesDetails;
        } else {
            return details;
        }
    }

    const getCatagoryArray = () => {
        if(selectedCatagories === '0'){
            return VehicleCatagories;
        } else {
            return ProperitiesCatagories;
        }
    };

    const handleSubmit = async() => {

        let attahcedFilesError = false;
        let errorEncountered = false;

        if(selectedCatagories !== '0' && selectedCatagories !== '1') errorEncountered = true;

        if(!VehicleCatagories.find(i => i.value === specificCatagory) 
        && !ProperitiesCatagories.find(i => i.value === specificCatagory)){
            setSpecificCatagory('-2');
            errorEncountered = true;
        }

        if(!itemTitle || typeof itemTitle !== 'string' || itemTitle.length < 5){
            setItemTitle('-1');
            errorEncountered = true;
        }

        if(!itemDesc || typeof itemDesc !== 'string' || itemDesc.length < 25){
            setItemDesc('-1');
            errorEncountered = true;
        }

        if(area === -1 || (area > 0 && (typeof area !== 'number' || area < 0 || area > 1000000))){
            setArea(-1);
            errorEncountered = true;
        }

        if(!contacts || !contacts?.length > 0){
            setContactsError('Please write at least one contact method.');
            errorEncountered = true;
        } else {
            for (let i = 0; i < contacts.length; i++) {
                if(!isValidContactURL(contacts[i])) {
                    setContactsError('There is an invalid link. Please choose a platform and enter a valid link.');
                    errorEncountered = true;
                }
            }
        }

        if(!itemCity || itemCity === {} || typeof itemCity.value !== 'string' || itemCity.value.length <= 0){
            const obj = itemCity;
            obj.value = '-1';
            setItemCity(obj);
            errorEncountered = true;
        }

        if(!itemNeighbour || typeof itemNeighbour !== 'string' || itemNeighbour.length > 100){
            setItemNeighbour('');
        }
        
        if(!itemPrice || typeof itemPrice !== 'number' || itemPrice <= 0 || itemPrice > 10000000000000){
            setItemPrice(-1);
            errorEncountered = true;
        }

        if(itemLong || itemLat){
            if(!isInsideJordan(itemLong, itemLat)){
                setError('Error in location data, please specify a valid location on the map');
                errorEncountered = true;
            }
        }

        if(errorEncountered === true){
            window.scrollTo({
                top: contactsError?.length > 0 
                ? window.scrollY + attachImagesDivRef.current.getBoundingClientRect().top 
                : 320, behavior: 'smooth'
            });
            setError('Complete the empty fields.');
            setSuccess(false);
            return;
        }

        setContactsError('');

        try {

            setLoading(true);

            const optimizedFiles = await getOptimizedAttachedFiles(attachedFilesUrls);

            setAttachedFilesUrls(optimizedFiles.optArr);

            //attached file, atleast one
            if(optimizedFiles.optArr.length <= 0){
                attahcedFilesError = true;
                errorEncountered = true;
            }

            //check for valid details
            if((selectedCatagories === '1' && (guestRoomsDetailArray.length + companionsDetailArray.length 
                + bathroomsDetailArray.length + kitchenDetailArray.length
                + roomsDetailArray.length + conditionsAndTerms.length) < 2)
                || (selectedCatagories === '0' && (vehicleSpecifications.length + vehicleFeatures.length) < 2)
                ){
                setError(attahcedFilesError ? 'Add pictures and videos that express what is on offer, and add at least two details in the details field.' : 'Add at least two details in the details field.');
                errorEncountered = true;
            } else {
                if(attahcedFilesError === true) setError('Add pictures and videos that express what is displayed.');
            }

            if(errorEncountered === true) {
                if(attachImagesDivRef.current){
                    window.scrollTo({
                        top: window.scrollY + attachImagesDivRef.current.getBoundingClientRect().top, behavior: 'smooth'
                    });
                }
                setSuccess(false);
                setLoading(false);
                return;
            };

            /*  create property or vehicle instance then 
                upload images with the id of the created instance  */

            const xDetails = selectedCatagories === '0' ? {
                vehicle_specifications: vehicleSpecifications,
                vehicle_addons: vehicleFeatures,
                near_places: nearPlaces
            } : {
                insurance:  requireInsurance, 
                guest_rooms: guestRoomsDetailArray, 
                facilities: companionsDetailArray, 
                bathrooms: bathroomsDetailArray, 
                kitchen: kitchenDetailArray, 
                rooms: roomsDetailArray,
                near_places: nearPlaces
            };

            let tempContacts = [];

            contacts.forEach((item) => {
                tempContacts.push({
                    platform: item.platform, val: item.val
                });
            });

            const token = await getRecaptchaToken();
            
            const res = await createProperty(
                selectedCatagories === '0' ? true : false, 
                specificCatagory, itemTitle, itemDesc, 
                itemCity.value, itemNeighbour, [itemLong, itemLat], itemPrice, 
                xDetails, conditionsAndTerms, area > 0 ? area : null,
                tempContacts?.length > 0 ? tempContacts : null, true, token
            );

            if(res.success !== true){
                setError(res.dt.toString());
                setLoading(false);
                setSuccess(false);
                return;
            }

            const uploadFilesRes = await uploadFiles(
                optimizedFiles.optArr, res.dt.id, storageKey, userEmail, true
            );

            console.log('upload res: ', uploadFilesRes);

            if(uploadFilesRes.success !== true){
                setError(uploadFilesRes.dt.toString());
                setLoading(false);
                setSuccess(false);
                return;
            };

            setSuccess(true);
            setError('');
            setLoading(false);
            
        } catch (err) {
            setError(err.message);
            setLoading(false);
            setSuccess(false);
        }

    };

    const showMap = () => {
        setIsMap(true);            
        if(mapUsed === false || !itemLong || !itemLat || !JordanCities || JordanCities.length <= 0){
            const obj = JordanCities.find(i => i.city_id === itemCity?.city_id);
            setLatitude(obj?.lat ? obj.lat : null);
            setLongitude(obj?.long ? obj.long : null);
        }
        setMapUsed(true);
        setMapType('select-point');
    };

    useEffect(() => {
        setSpecificCatagory('-1');
    }, [selectedCatagories]);

    useEffect(() => {
        if(mapUsed === true){
            setItemLong(longitude);
            setItemLat(latitude);
        }
    }, [longitude, latitude]);

    useEffect(() => {
        console.log('city changed');
        setMapUsed(false);
    }, [itemCity]);

    useEffect(() => {
        if(!loadingUserInfo && userId?.length > 0) setFetching(false);
    }, [userId]);

    const RightIconSpan = () => {
        return <span id='righticonspan'/>
    }

    if(!userId?.length > 0 || !isVerified){
        return (
            fetching ? <MySkeleton isMobileHeader={true}/> : <NotFound type={'not allowed'}/>
        )
    }

  return (
    <div className='add' dir='ltr'>

        <span id='closePopups' onClick={() => setCityPopup(false)} style={{ display: !cityPopup && 'none' }}/>

        <div className='wrapper'>

            <h2>What do you want to offer for rent?</h2>

            <div className='selectCatagory' style={{ width: '100%' }}>

                <CatagoryCard type={'add'} image={VehicleImage} title={'Vehicle'} catagoryId={'0'} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>
                
                <CatagoryCard type={'add'} image={selectedCatagories !== '1' ? PropertyImage : PropertyWhiteImage} title={'Real estate'} catagoryId={'1'} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>

            </div>

            <div className='selectKind'>
                <select value={specificCatagory} onChange={(e) => setSpecificCatagory(e.target.value)}>
                    <option value={'-1'} hidden selected>{selectedCatagories === '0' ? 'Choose vehicle catagory' : 'Choose reat estate catagory'}</option>
                    {getCatagoryArray().map((item) => (
                        <option key={item._id} value={item.value}>{getNameByLang(item.arabicName, true)}</option>
                    ))}
                </select>
                <label id='error'>{specificCatagory === '-2' && 'choose a catagory'}</label>
            </div>

            <CustomInputDiv isError={itemTitle === '-1' && true} errorText={'Please write a title of five or more characters.'} title={'Title'} placholderValue={itemTitle} listener={(e) => setItemTitle(e.target.value)}/>

            <CustomInputDiv isError={itemDesc === '-1' && true} errorText={'Please write a clear description of what you want to display, in no less than 10 words.'} title={'Description'} isTextArea={true} listener={(e) => setItemDesc(e.target.value)} type={'text'}/>

            <div className='address'>
                <div className='popup-wrapper'>
                    <CustomInputDiv settingFocused={() => setCityPopup(true)} isCity={true} isError={itemCity?.value === '-1' && true} errorText={'Select the city where the rental is available'} title={'City'} value={itemCity?.arabicName} type={'text'}/>
                    {cityPopup && <HeaderPopup type={'add-city'} isEnglish itemCity={itemCity} setItemCity={setItemCity}/>}
                </div>
                <CustomInputDiv title={'Neighbourhood'} listener={(e) => setItemNeighbour(e.target.value)} type={'text'}/>
            </div>

            <div className='googleMapDiv' onClick={showMap}>
                <span>Locate using map</span>
                <Image src={GoogleMapImage}/>
            </div>

            <div className='priceDiv'>
                <CustomInputDiv isError={itemPrice === -1 && true} errorText={'Set a price per night'} title={'Price in dollars'} listener={(e) => setItemPrice(Number(e.target.value))} type={'number'}/>
                <strong>/</strong>
                <h4>Night</h4>
            </div>

            <div className='attachFiles' ref={attachImagesDivRef}>

                <button onClick={() => inputFilesRef.current.click()}>Choose a file</button>

                <ul style={{ gridTemplateColumns: attachedFilesUrls.length <= 0 && '1fr' }}>
                    {attachedFilesUrls.map((attachedFile) => (
                        <li onClick={() => {
                            setAttachedFilesUrls(attachedFilesUrls.filter(f => f !== attachedFile))
                        }}>
                            {attachedFile.type.split('/')[0] === 'image'
                            ? <Image src={URL.createObjectURL(attachedFile)} width={100} height={100}/>
                            : <video autoPlay loop src={URL.createObjectURL(attachedFile)}/>
                            }
                        </li>
                    ))}
                    <li id='chooseFileLastLi'
                        onClick={() => inputFilesRef.current.click()}
                    >{attachedFilesUrls.length > 0 ? 'Add more' : `Choose videos & images for the ${selectedCatagories === '0' ? 'vehicle' : 'real estate'}`}<p>(File type must be PNG, JPG, MP4, or AVI)</p></li>
                </ul>

                <input ref={inputFilesRef} accept='.png, .jpeg, .mp4, .avi' type='file' onChange={(e) => {
                    const file = e.target.files[0];
                    console.log(file);
                    if(file && allowedMimeTypes.includes(file.type)){
                        setAttachedFilesUrls([...attachedFilesUrls, file])
                    }
                }}/>

            </div>

            <div className='detailsAboutItem'>

                <h2>Add details about the {selectedCatagories === '0' ? 'vehicle' : 'real estate'}</h2>

                <div className='insuranceDetail'>
                    <h3>Does rent require insurance?</h3>
                    <input type='radio' name='insurance_group' onChange={() => setRequireInsurance(true)}/><label>Yes</label>
                    <input checked={requireInsurance ? false : true} type='radio' name='insurance_group' onChange={() => setRequireInsurance(false)}/><label>No</label>
                </div>

                <div className='detailItem area-div' style={{ display: selectedCatagories === '0' ? 'none' : null}}>
                    <h3>Write the area of ​​the property in meters</h3>
                    <CustomInputDiv title={area > 0 ? `${area} Square meters` : ''} max={1000000} min={0} myStyle={{ marginBottom: 0 }} placholderValue={'Ex: 40'} value={area > 0 ? area : 'Ex: 40'} type={'number'} isError={area === -1} errorText={'Please enter a valid space'} listener={(e) => {
                        if(Number(e.target.value)) setArea(e.target.value);
                    }}/>
                </div>

                <div className='detailItem contacts-div'>
                    <h3>Add communication methods</h3>
                    <p style={{ marginBottom: contactsError?.length > 0 ? null : 0 }} id='error'>{contactsError}</p>
                    <ul className='detailItem-ul'>
                    {contacts.map((c, index) => (
                        <li key={index}>
                            <CustomInputDiv value={c.val} 
                            deletable handleDelete={() => {
                                let arr = [];
                                for (let i = 0; i < contacts.length; i++) {
                                    if(i !== index){
                                        arr.push(contacts[i]);
                                    }
                                }
                                setContacts(arr);
                            }}
                            listener={(e) => {
                                let arr = [...contacts];
                                arr[index] = { platform: arr[index].platform, val: e.target.value, isPlatforms: arr[index].isPlatforms };
                                setContacts(arr);
                            }}/>
                            <div className='choose-platform'>
                                <button className={c.isPlatforms ? 'editDiv rotate-edit-div' : 'editDiv'} onClick={() => {
                                    let arr = [...contacts];
                                    arr[index] = { platform: arr[index].platform, val: arr[index].val, isPlatforms: !arr[index].isPlatforms };
                                    for (let i = 0; i < contacts.length; i++) {
                                        if(i !== index){
                                            arr[i] =  { platform: arr[i].platform, val: arr[i].val, isPlatforms: false };
                                        }
                                    }
                                    setContacts(arr);
                                }}>
                                    {c?.platform?.length > 0 ? c.platform : 'Choose platform'} <Svgs name={'dropdown arrow'}/>
                                </button>
                                <ul style={{ display: c.isPlatforms ? null : 'none' }}>
                                    {contactsPlatforms.map((p) => (
                                        <li onClick={() => {
                                            let arr = [...contacts];
                                            arr[index] = { platform: p, val: arr[index].val, isPlatforms: false };
                                            setContacts(arr);
                                            console.log(arr, p);
                                        }}>{p} {p === c.platform && <RightIconSpan />}</li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                    </ul>
                    <button className='btnbackscndclr' onClick={() => setContacts([...contacts, { platform: '', val: '', isPlatforms: false }])}>Add more</button>
                </div>
                
                {getDetails().map((item) => (
                    <div className='detailItem'>
                        <h3>{item.name}</h3>
                        <ul className='detailItem-ul'>
                            {item.array.map((obj, myIndex) => (
                                <li key={myIndex}>
                                    <CustomInputDiv placholderValue={obj} value={obj} deletable handleDelete={() => {
                                        let arr = [];
                                        for (let i = 0; i < item.array.length; i++) {
                                            if(i !== myIndex){
                                                arr.push(item.array[i]);
                                            }
                                        }
                                        item.setArray(arr);
                                    }} 
                                    listener={(e) => {
                                        let arr = [...item.array];
                                        arr[myIndex] = e.target.value;
                                        item.setArray(arr);
                                    }}/>
                                </li>
                            ))}
                        </ul>
                        <button style={{ marginTop: item.array.length <= 0 && 'unset' }} onClick={
                            () => item.setArray([...item.array, ''])
                        }>{'Add detail'}</button>
                    </div>
                ))}

            </div>

            <div className='addTermsAndConditions'></div>
            
            <div className='submitItem'>

                <h2>Tips before sending</h2>

                <h4>- Be precise in your title and description</h4>
                
                <h4>- Add clear and expressive images</h4>

                <h4>- Add as much information as possible in the details field</h4>

                <label id='error2' style={{ padding: error.length <= 0 && 0, margin: error.length <= 0 && 0 }}>{error}</label>
                
                <label id='success' style={{ padding: !success && 0, margin: !success && 0 }}>{success && 'sent succesfully'}</label>
                
                <button onClick={handleSubmit}>{loading ? 'sending ...' : 'Send'}</button>
                
            </div>

        </div>

    </div>
  )
}

export default page
