import '../../properties/Properties.scss';
import PropertiesArray from '@components/PropertiesArray';
import PageFilterHeader from '@components/PageFilterHeader';

const page = () => {

    const cardsPerPage = 16;
    
  return (
    <div className="properitiesPage" dir='ltr'>

        <PageFilterHeader isEnglish isVehicles/>

        <PropertiesArray isEnglish type={'vehicles'} cardsPerPage={cardsPerPage}/>

    </div>
  )
}

export default page
