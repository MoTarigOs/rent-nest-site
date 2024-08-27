import Svgs from "@utils/Svgs";
import Image from "next/image";
import '@styles/components_styles/ItemImagesLoader.scss';
import { motion } from "framer-motion";

const ItemImagesLoader = ({ 
    images, videos, isEnglish, isShow, 
    setIsShow, setImageFullScreen
 }) => {

  return (
    <motion.div className="images-loader"
        initial={{
            y: '-100%',
            display: 'none'
        }}
        animate={{
            y: isShow ? 0 : '-100%',
            display: isShow ? 'block' : 'none',
        }}
        transition={{
            damping: 18, stiffness: 85, type: 'spring', ease: 'easeIn'
        }}
    >

        <div>
            <Svgs name={'cross'} on_click={() => setIsShow(false)}/>
        </div>

        <ul>
            {images?.length > 0 && images?.map((img, index) => (
                <li onClick={() => setImageFullScreen(img)}>
                    <Image loading={'lazy'}
                        src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${img}`} width={100} height={100} alt={isEnglish ? 'Image about the offer' : 'صورة عن العرض'}
                        />
                </li>
            ))}
            {videos?.length > 0 && videos?.map((vd) => (
                <li>
                    <video controls src={`${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${vd}`}/>
                </li>
            ))}
        </ul> 
      
    </motion.div>
  )
};

export default ItemImagesLoader;
