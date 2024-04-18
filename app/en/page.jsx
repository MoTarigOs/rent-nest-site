import AboutSection from "@sections/AboutSection";
import HeroSection from "@sections/HeroSection";
import LandingSection from "@sections/LandingSection";

const page = () => {

    return (

        <div className="home" dir="ltr">
            
            <LandingSection isEnglish={true}/>

            <HeroSection isEnglish={true}/>

            <AboutSection isEnglish={true}/>

        </div>

    )
};

export default page;
