export async function generateMetadata({ params }){
  
  return { 
      title: params.itemTitle
  };
  
};

const Layout = ({ children }) => {
  return (
    <main>{children}</main>
  )
};

export default Layout;
  