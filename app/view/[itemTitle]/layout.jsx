import { decodeArabicUrl } from "@utils/Logic";
import { fetchPropertyDetails, getPropIdByUnitCode } from "@utils/api";

export async function generateMetadata({ params,  }){

  const title = decodeArabicUrl(params.itemTitle) || 'عرض ايجار';

  let propObj = null; 

  if(title.slice(0, 4) === 'unit' && !isNaN(title?.split('unit')?.at(1))) {
      const res = await getPropIdByUnitCode(title?.split('unit')?.at(1));
      if(res?.ok === true) {
        const resObj = await fetchPropertyDetails(res.dt.id);
        if(resObj.success === true) {
          propObj = resObj.dt;
        }
      }
  }

  console.log('layout --------------- ', propObj);

  return !propObj ? { 
      title
  } : {
    title: propObj.title,
    description: propObj.description,
    openGraph: {
      title: propObj.title,
      description: propObj.description,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/download/${propObj.images?.at(0)}`, // Must be an absolute URL
          width: 800,
          height: 600,
        }
      ]
    }
  };
  
};

const Layout = ({ children }) => {
  return (
    <main>{children}</main>
  )
};

export default Layout;
  