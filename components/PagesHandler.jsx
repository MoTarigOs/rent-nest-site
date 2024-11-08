'use client';

import { useEffect, useState } from "react";
import '@styles/components_styles/PagesHandler.scss';

const PagesHandler = ({ 
    properitiesArray, foundItems, indexSlide, setIndexSlide, 
    cardsPerPage, city, isEnglish, triggerPropsArrayFetch,
    isHide, centerTheDiv
}) => {
    
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesNumber, setPagesNumber] = useState(1);

    useEffect(() => {
        if(currentPage > pagesNumber) setCurrentPage(pagesNumber);
        if(currentPage < 1) setCurrentPage(1);
        setIndexSlide((currentPage - 1) * cardsPerPage);
        window.scrollTo({
            top: 0, behavior: 'smooth'
        });
        triggerPropsArrayFetch((currentPage - 1) * cardsPerPage);
    }, [currentPage]);

    useEffect(() => {
        if(foundItems > cardsPerPage){
            setPagesNumber(Math.ceil(foundItems / cardsPerPage));
            setCurrentPage(1);
            setIndexSlide(0);
        } else {
            setPagesNumber(1);
            setCurrentPage(1);
            setIndexSlide(0);
        };
    }, [foundItems]);

  return (
    <div className="pagesHandler" style={{ 
        display: isHide ? 'none' : undefined,
        justifyContent: centerTheDiv ? 'center' : undefined,
        flexDirection: centerTheDiv ? 'column' : undefined,
        flexDirection: 'row'
    }} dir={isEnglish ? 'ltr' : undefined}>

        <div className="pagination-text">
            {foundItems > 0 ? <>{'('}
            {indexSlide + 1} - 
            {(foundItems - indexSlide + 1 > cardsPerPage 
                ? indexSlide + cardsPerPage 
                : foundItems) + ') '} 
            {isEnglish ? 'from ' : 'من '} 
            {foundItems} 
            {isEnglish ? ' units ' : ' عقار '} 
            {city?.value?.length > 0 
                ? (isEnglish ? 'in ' : 'في ') + (isEnglish ? city?.value : city?.arabicName) 
                : ''}</> : isEnglish ? 'No units found' : 'لا يوجد نتائج'}
        </div>

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

    </div>
  )
};

export default PagesHandler;
