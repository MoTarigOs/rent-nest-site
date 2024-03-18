
import '@styles/sections_styles/Catagories.css';
import { ProperitiesCatagories, VehicleCatagories } from '@utils/Data';
import CatagoryCard from '@components/CatagoryCard';

const Catagories = ({ type, selectedCatagories, setSelectedCatagories }) => {

  const getArray = () => {
    if(type === 'veh'){
      return VehicleCatagories;
    } else {
      return ProperitiesCatagories;
    }
  };

  return (
    <div className="catagoriesSection">
        
        <h2>اختر تصنيفا</h2>

        <ul>
          {getArray().map((ctg) => (
            <CatagoryCard key={ctg._id} catagoryId={ctg._id} image={ctg.pic} title={ctg.title} selectedCatagories={selectedCatagories} setSelectedCatagories={setSelectedCatagories}/>
          ))}
        </ul>

    </div>
  )
}

export default Catagories
