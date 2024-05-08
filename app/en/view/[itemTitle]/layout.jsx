import { decodeArabicUrl } from "@utils/Logic";

export async function generateMetadata({ params }){
  
  const title = decodeArabicUrl(params.itemTitle) || 'Property for rent';

  return { 
      title
  };
  
};

const Layout = ({ children }) => {
  return (
    <main>{children}</main>
  )
};

export default Layout;
  