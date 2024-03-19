'use client';

import './View.css';
import ImagesShow from "@components/ImagesShow";
import { JordanCities } from "@utils/Data";
import GoogleMapImage from '@assets/images/google-map-image.jpg';
import Image from "next/image";
import LocationGif from '@assets/icons/location.gif';
import Svgs from '@utils/Svgs';
import { useEffect, useState } from 'react';
import ReviewCard from '@components/ReviewCard';
import HeaderPopup from '@components/popups/HeaderPopup';
import { useSearchParams } from 'next/navigation';
import { fetchPropertyDetails } from '@utils/api';

const page = () => {

  const [loading, setLoading] = useState(false);
  const [runOnce, setRunOnce] = useState(false);
  const [item, setItem] = useState(null);
  const [isVideosFiles, setIsVideosFiles] = useState(false);

  const [reviewsNumber, setReviewsNumber] = useState(1);
  const [isCalendar, setIsCalendar] = useState(false);
  const [bookDate, setBookDate] = useState([new Date, new Date]);
  const [isSpecifics, setIsSpecifics] = useState(true);
  const [isReviews, setIsReviews] = useState(false);
  const [isMap, setIsMap] = useState(false);
  const [isTerms, setIsTerms] = useState(false);
  const id = useSearchParams().get('id');

  function getNumOfBookDays (){
  
    if(!bookDate || !bookDate[0] || !bookDate[1] || bookDate[0] === bookDate[1]) return 1;

    const x = Math.ceil((bookDate[1].getTime() - bookDate[0].getTime()) / (1000 * 60 * 60 * 24)) - 1;

    if(x > 1) return x;
    
    return 1;

  };

  async function fetchItemDetails () {

    try {

      if(!id || id.length < 10) return;

      setLoading(true);

      const res = await fetchPropertyDetails(id);

      if(res.success !== true) {
        setLoading(false);
        return;
      }

      console.log(res.dt);

      setItem(res.dt);
      setLoading(false);
      
    } catch (err) {
      setLoading(false);
    }

  };

  useEffect(() => {
    setRunOnce(true);
  }, []);

  useEffect(() => {
    if(runOnce === true) fetchItemDetails();
  }, [runOnce]);

  if(!item){
    return(
      <div className='view'>{loading ? 'جاري التحميل' : 'لم يتم ايجاد العرض'}</div>
    )
  }

  return (
    <div className="view">

      <div className='intro'>

        <div className='itemIntro'>

          <h1>{item.title}</h1>

          <ul>
            <li><Svgs name={'star'}/> {item.ratings.val} ({item.ratings.no} تقييم)</li>
            <li><Svgs name={'star'}/> {JordanCities.find(i => i.value === item.city).arabicName}, {item.neighbourhood}</li>
            <li><Svgs name={'star'}/> المساحة {item.area} م2</li>
            <li id='giveThisMarginRight'><Svgs name={'wishlist'}/> اضف الى المفضلة</li>
            <li><Svgs name={'share'}/> مشاركة</li>
          </ul>

        </div>

        <div className='iamgesViewDiv'>
          <div className='btns'>
            <button onClick={() => setIsVideosFiles(false)} className={!isVideosFiles && 'selectedFileType'}>الصور</button>
            <button onClick={() => setIsVideosFiles(true)} className={isVideosFiles && 'selectedFileType'}>الفيديوهات</button>
          </div>
          <ImagesShow handleWishList={() => {}} images={item.images} videos={item.videos} type_is_video={isVideosFiles}/>
        </div>

      </div>

      <div className="aboutItem">

        <div className="details">
          
          <label>الوصف</label>

          <p>{item.description}</p>

          <ul className='tabButtons'>
            <li className={isSpecifics && 'selectedTab'} onClick={() => {setIsSpecifics(true); setIsReviews(false); setIsMap(false); setIsTerms(false)}}>المواصفات</li>
            <li className={isReviews && 'selectedTab'} onClick={() => {setIsSpecifics(false); setIsReviews(true); setIsMap(false); setIsTerms(false)}}>التقييمات</li>
            <li className={isMap && 'selectedTab'} onClick={() => {setIsSpecifics(false); setIsReviews(false); setIsMap(true); setIsTerms(false)}}>الخريطة</li>
            <li className={isTerms && 'selectedTab'} onClick={() => {setIsSpecifics(false); setIsReviews(false); setIsMap(false); setIsTerms(true)}}>الشروط و الأحكام</li>
          </ul>

          <h2>{isSpecifics ? 'المواصفات' : isReviews ? 'التقييمات' : isMap ? 'الخريطة' : isTerms ? 'الأحكام و الشروط' : ''}</h2>

          <ul className='specificationsUL' style={{ display: !isSpecifics && 'none' }}>
            {!item.type_is_vehicle ? <>
              <li><Svgs name={'insurance'}/><h3>{item.details.insurance === true ? 'يتطلب تأمين قبل الحجز' : 'لا يتطلب تأمين'}</h3></li>
              <li><Svgs name={'guest room'}/><h3>غرف الضيوف</h3><ul>{item.details.guest_rooms.map((i) => (<li>{i}</li>))}</ul></li>
              <li><Svgs name={'facilities'}/><h3>المرافق</h3><ul>{item.details.facilities.map((i) => (<li>{i}</li>))}</ul></li>
              <li><Svgs name={'bathrooms'}/><h3>دورات المياه</h3><ul>{item.details.bathrooms.map((i) => (<li>{i}</li>))}</ul></li>
              <li><Svgs name={'kitchen'}/><h3>المطبخ</h3><ul>{item.details.bathrooms.map((i) => (<li>{i}</li>))}</ul></li>
              <li id='lastLiTabButtonUL' ><Svgs name={'rooms'}/><h3>الغرف</h3><ul>{item.details.bathrooms.map((i) => (<li>{i}</li>))}</ul></li>
            </> : <>
              <li><Svgs name={'vehicle specifications'}/><h3>مواصفات السيارة</h3><ul>{item?.details?.vehicle_specifications?.map((i) => (<li>{i}</li>))}</ul></li>
              <li><Svgs name={'vehicle addons'}/><h3>ملحقات السيارة</h3><ul>{item?.details?.vehicle_addons?.map((i) => (<li>{i}</li>))}</ul></li>
            </>}
          </ul>

          <div className='reviews' style={{ display: !isReviews && 'none' }}>

            <ul>
              {item.reviews.slice(0, reviewsNumber).map((rv) => (
                <ReviewCard item={rv}/>
              ))}
            </ul>

            <button onClick={() => setReviewsNumber(reviewsNumber + 10)}>المزيد من التقييمات</button>

          </div>

          <div className='mapDiv' style={{ display: !isMap && 'none' }}>

            <div className='addressMapDiv'><Image src={LocationGif}/><h3>{JordanCities.find(i => i.value === item.city).arabicName}, {item.neighbourhood}</h3></div>
          
            <h5 className='moreDetailsAfterPay'><Svgs name={'info'}/>سنرسل لك تفاصيل دقيقة عن الموقع بعد تأكيد الشراء</h5>

            <div className='mapImagePlaceholder'>
              <Image src={GoogleMapImage}/>
            </div>
          
          </div>

          <ul className='termsUL' style={{ display: !isTerms && 'none' }}>
            <li id='hostLiTermsUL'><h3>شروط مقدم الخدمة (المضيف)</h3>
              <ul>
                {item.terms_and_conditions.map((tc) => (
                  <li key={tc}>{tc}</li>
                ))}
              </ul>
            </li>
            <li id='hostLiTermsUL'><h3>شروط و أحكام المنصة</h3>
                <ul>
                  <li>اختر شروطا هنا</li>
                  <li>اختر شروطا هنا 2</li>
                </ul>
            </li>
          </ul>
          

        </div>

        <h2 id='checkoutDetailsH2'>تفاصيل الحجز</h2>

        <div className='checkout'>

          {isCalendar && <HeaderPopup type={'calendar'} setCalender={setBookDate}/>}

          <div className='nightsDiv'>
            <h3 style={{ color: 'var(--secondColorDark)' }}>{item.price}<span>دولار / ليلة</span></h3>
            <h3 style={{ color: '#777' }}><span>عدد الليالي</span> {getNumOfBookDays()}</h3>
          </div>

          <div className='bookingDate' onClick={() => setIsCalendar(!isCalendar)}>
            تاريخ الحجز
            <h3 suppressHydrationWarning>{bookDate[0].toLocaleDateString('ar', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</h3>
          </div>

          <div className='bookingDate' onClick={() => setIsCalendar(true)}>
            تاريخ انتهاء الحجز
            <h3 suppressHydrationWarning>{bookDate[1].toLocaleDateString('ar', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</h3>
          </div>

          <div className='cost'>
            <h3>تخفيض {item.discount.percentage}% <span>- {(getNumOfBookDays() * item.price * item.discount.percentage / 100).toFixed(2)} دولار</span></h3>
            <h3>اجمالي تكلفة {getNumOfBookDays()} ليلة <span>{((getNumOfBookDays() * item.price) - (getNumOfBookDays() * item.price * item.discount.percentage / 100)).toFixed(2)} دولار</span></h3>
          </div>

          <button id='bookButton'>احجز</button>

        </div>

      </div>

      {isCalendar && <span onClick={() => setIsCalendar(false)} id='spanForClosingPopups'/>}

    </div>
  )
}

export default page
