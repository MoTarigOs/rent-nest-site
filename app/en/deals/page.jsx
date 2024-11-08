import '../../properties/Properties.scss';
import PropertiesArray from "@components/PropertiesArray";
import PageFilterHeader from '@components/PageFilterHeader';

const Page = () => {

    const cardsPerPage = 16;

  return (
    <div className="properitiesPage" dir='ltr'>

        <PageFilterHeader isEnglish/>

        <PropertiesArray type={'deals'} cardsPerPage={cardsPerPage} isEnglish/>

    </div>
  )
}

export default Page;
