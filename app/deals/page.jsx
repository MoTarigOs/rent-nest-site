import '../properties/Properties.scss';
import PropertiesArray from "@components/PropertiesArray";
import PageFilterHeader from '@components/PageFilterHeader';

const Page = () => {

    const cardsPerPage = 16;

  return (
    <div className="properitiesPage">

        <PageFilterHeader />

        <PropertiesArray type={'deals'} cardsPerPage={cardsPerPage}/>

    </div>
  )
}

export default Page;
