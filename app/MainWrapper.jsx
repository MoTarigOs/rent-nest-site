'use client';

import Footer from "@sections/Footer";
import Header from "@sections/Header";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Roboto, Cairo } from 'next/font/google';
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import { Context } from "@utils/Context";
 
const roboto = Roboto({ weight: '400', subsets: ['latin'] });
const cairo = Cairo({ weight: '400', subsets: ['latin'] });

const MainWrapper = ({ children }) => {

  const pathname = usePathname();

  const { isModalOpened, setArabicFont, setEnglishFont } = useContext(Context);

  useEffect(() => {
    setArabicFont(roboto.style.fontFamily);
    setEnglishFont(roboto.className);
  }, []);

  useEffect(() => {
      if(isModalOpened){
        document.querySelector("body").classList.add("disable-scrolling");
      } else {
        document.querySelector("body").classList.remove("disable-scrolling");
      }
  }, [isModalOpened]);

  return (

    <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        scriptProps={{
            async: true,
            defer: false,
            appendTo: "body",
            nonce: undefined,
        }}>

        <div className={`main ${pathname.includes('/en') ? roboto.className : cairo.className}`}>
                        
            <Header arabicFontClassname={cairo.className} pathname={pathname}
              englishFontClassname={roboto.className}/>

            <main className='app'>
                {children}
            </main>

            <Footer pathname={pathname}/>
        
        </div>

    </GoogleReCaptchaProvider>

  )
};

export default MainWrapper;
