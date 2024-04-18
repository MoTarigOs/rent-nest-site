import '@styles/components_styles/CatagoryCard.css';
import Image from 'next/image';

const CatagoryCard = ({ catagoryId, title, selectedCatagories, setSelectedCatagories, image, type }) => {
  return (
    <li onClick={() => {
      if(type !== 'add'){
        if(selectedCatagories.includes(catagoryId)){
          setSelectedCatagories(
          selectedCatagories.filter(
              c => c !== catagoryId
          )
          );
        } else {
            setSelectedCatagories([...selectedCatagories, catagoryId])
        }
      } else {
        if(selectedCatagories !== catagoryId){
          setSelectedCatagories(catagoryId);
        }
      }
        
        }} className={`catagoryCard ${selectedCatagories.includes(catagoryId) && 'selectedCatgoryVehicle'}`}>
        <Image src={image ? image : ''}/>
        <h3>{title}</h3>
    </li>   
  )
};

export default CatagoryCard;
