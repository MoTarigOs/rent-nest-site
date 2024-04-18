'use client';

import Footer from "@sections/Footer";
import Header from "@sections/Header";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Roboto, Cairo } from 'next/font/google'
import { useContext } from "react";
import { Context } from "@utils/Context";
 
const roboto = Roboto({ weight: '400', subsets: ['latin'] });
const cairo = Cairo({ weight: '400', subsets: ['latin'] });

const MainWrapper = ({ children }) => {

  const { isEnglish } = useContext(Context);

  return (

    <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        scriptProps={{
            async: true,
            defer: false,
            appendTo: "body",
            nonce: undefined,
        }}>

        <div className={`main ${isEnglish ? roboto.className : cairo.className}`}>
                        
            <Header arabicFontClassname={cairo.className} englishFontClassname={roboto.className}/>

            <main className='app'>
                {children}
            </main>

            <Footer />
        
        </div>

    </GoogleReCaptchaProvider>

  )
};

export default MainWrapper;
