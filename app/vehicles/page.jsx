'use client'

import Card from "@components/Card";
import Svgs from "@utils/Svgs";
import '../properties/Properties.css';
import { useContext, useEffect, useState } from "react";
import { Context } from "@utils/Context";
import { getProperties } from "@utils/api";
import { maximumPrice, minimumPrice } from "@utils/Data";
import { arrangeArray } from "@utils/Logic";

const page = () => {

    const [fetching, setFetching] = useState(false);
    const [properitiesArray, setProperitiesArray] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [indexSlide, setIndexSlide] = useState(0);
    const [pagesNumber, setPagesNumber] = useState(1);
    const [skip, setSkip] = useState(0);
    const cardsPerPage = 4;

    const { 
        currentMinPrice, currentMaxPrice, city, catagory, 
        ratingScore, triggerFetch, searchText, 
        arrangeValue, setArrangeValue
    } = useContext(Context);

    const handleArrowPagesNav = (isPrev) => {
        if(isPrev){
            if(currentPage > 1) setCurrentPage(currentPage - 1);
        } else {
            if(currentPage < pagesNumber) setCurrentPage(currentPage + 1);
        }
    };

    const settingPropertiesArray = async() => {

        if(fetching) return;

        try {

            setFetching(true);
            
            const res = await getProperties(
                city.value, true, catagory, 
                (currentMinPrice !== minimumPrice || currentMaxPrice !== maximumPrice) 
                    ? `${currentMinPrice},${currentMaxPrice}` : null,
                ratingScore, searchText, null, skip    
            );

            if(res.success !== true) {
                setFetching(false);
                return;
            };

            setProperitiesArray(res.dt);

            setCurrentPage(1);

            setFetching(false);

        } catch (err) {
            console.log(err);
            setFetching(false);
        }
    };

    useEffect(() => {
        settingPropertiesArray();
    }, []);

    useEffect(() => {
        if(currentPage > pagesNumber) setCurrentPage(pagesNumber);
        if(currentPage < 1) setCurrentPage(1);
        setIndexSlide((currentPage - 1) * cardsPerPage);
        window.scrollTo({
            top: 0, behavior: 'smooth'
        })
    }, [currentPage]);

    useEffect(() => {
        if(properitiesArray.length > cardsPerPage){
            setPagesNumber(Math.ceil(properitiesArray.length / cardsPerPage));
        };
    }, [properitiesArray]);

    useEffect(() => {
        settingPropertiesArray();
    }, [triggerFetch]);

    useEffect(() => {
        setProperitiesArray(arrangeArray(arrangeValue.toString(), properitiesArray));
    }, [arrangeValue]);


    if(!properitiesArray || properitiesArray.length <= 0){
        return (
            <div className="properitiesPage">
                {fetching ? 'جاري تحميل العروض' : 'لم يتم ايجاد أي عروض'}
            </div>
        )
    }

    
  return (
    <div className="properitiesPage">

        <ul className="resultUL">
            {properitiesArray.slice(indexSlide, indexSlide + cardsPerPage).map((item) => (
                <Card key={item._id} item={item}/>
            ))}
        </ul>

        <div className="pagesHandler">

          <h4>النتائج</h4>

          <div  onClick={() => handleArrowPagesNav(true)}><Svgs name={'dropdown arrow'}/></div>

          {currentPage < 5 ? <><span onClick={() => setCurrentPage(1)} className={`pageNum ${currentPage === 1 && 'selectedPage'}`}>1</span>

          {pagesNumber >= 2 && <span onClick={() => setCurrentPage(2)} className={`pageNum ${currentPage === 2 && 'selectedPage'}`}>2</span>}

          {pagesNumber >= 3 && <span onClick={() => setCurrentPage(3)} className={`pageNum ${currentPage === 3 && 'selectedPage'}`}>3</span>}

          {pagesNumber >= 4 && <span onClick={() => setCurrentPage(4)} className={`pageNum ${currentPage === 4 && 'selectedPage'}`}>4</span>}

          {pagesNumber >= 5 && <span onClick={() => setCurrentPage(5)} className={`pageNum ${currentPage === 5 && 'selectedPage'}`}>5</span>}

          {pagesNumber > 5 && <>
              <span className="dotsBetweenPages">...</span>
              <span onClick={() => setCurrentPage(pagesNumber)} className={`pageNum ${currentPage === pagesNumber && 'selectedPage'}`}>{pagesNumber}</span>
          </>}
          </>

          : (currentPage < pagesNumber - 2 ? <><span onClick={() => setCurrentPage(1)} className={`pageNum ${currentPage === 1 && 'selectedPage'}`}>1</span>

              <span className="dotsBetweenPages">...</span>

              <span onClick={() => setCurrentPage(currentPage - 1)} className="pageNum">{currentPage - 1}</span>

              <span className="pageNum selectedPage">{currentPage}</span>

              <span onClick={() => setCurrentPage(currentPage + 1)} className="pageNum">{currentPage + 1}</span>

              <span className="dotsBetweenPages">...</span>

              <span onClick={() => setCurrentPage(pagesNumber)} className={`pageNum ${currentPage === pagesNumber && 'selectedPage'}`}>{pagesNumber}</span></> 
              
              : <><span onClick={() => setCurrentPage(1)} className={`pageNum ${currentPage === 1 && 'selectedPage'}`}>1</span>
              
                  <span className="dotsBetweenPages">...</span>

                  <span onClick={() => setCurrentPage(pagesNumber - 3)} className={`pageNum ${currentPage === pagesNumber - 3 && 'selectedPage'}`}>{pagesNumber - 3}</span>

                  <span onClick={() => setCurrentPage(pagesNumber - 2)} className={`pageNum ${currentPage === pagesNumber - 2 && 'selectedPage'}`}>{pagesNumber - 2}</span>

                  <span onClick={() => setCurrentPage(pagesNumber - 1)} className={`pageNum ${currentPage === pagesNumber - 1 && 'selectedPage'}`}>{pagesNumber - 1}</span>

                  <span onClick={() => setCurrentPage(pagesNumber)} className={`pageNum ${currentPage === pagesNumber && 'selectedPage'}`}>{pagesNumber}</span></>)
                  
          }

          <div onClick={() => handleArrowPagesNav(false)}><Svgs name={'dropdown arrow'}/></div>

        </div>

        <button id="moreProperties" style={{ display: (currentPage === pagesNumber && pagesNumber * cardsPerPage >= 300) ? 'block' : 'none' }} onClick={() => setSkip(skip + 1)}>تحميل المزيد من المعروضات</button>

    </div>
  )
}

export default page
