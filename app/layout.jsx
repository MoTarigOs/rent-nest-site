import '@styles/Main.css';
import MainWrapper from './MainWrapper';
import DataContext from '@utils/Context';

const Layout = ({ children }) => {

    return (

        <html lang="ar" dir="rtl">

            <head>

                <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />

                <title>Rent Nest | منصة ايجار عقارات داخل الاردن</title>

                <link rel="icon" sizes='256x256' href="/myicon.png" type='image/png'/>

                <link rel="apple-touch-icon" href="/myicon.png" type="image/png" sizes="256x256"/>

                <meta name="description" content="منصة Rent Nest , تقدم خدمات و إِيجار عقارات داخل دولة الاردن , حيث توجد عروض إِيجار شاليهات و شقق و بيوت و سكن طلاب و سيارات." />

                <meta name="keywords" content="ايجار عقارات, ايجار شقق, ايجار منازل, عقارات, سكن طلاب, مخيمات, شاليهات, منجعات, رنت نست, دولة الاردن, الاردن, مدينة عمان, البحر الميت" />

                <meta key="og:type" property="og:type" content={"website"} />
                <meta key="og:title" property="og:title" content={"Rent Nest | منصة ايجار عقارات داخل الاردن"} />
                <meta key="og:description" property="og:description" content={"منصة Rent Nest , تقدم خدمات و ايجار عقارات داخل دولة الاردن , حيث توجد عروض ايجار شاليهات و شقق و بيوت و سكن طلاب و سيارات."}/>
                {/* <meta key="og:url" property="og:url" content={"site url"}/> */}
                <meta key="og:image" property="og:image" content="https://f003.backblazeb2.com/file/personal-use-mot-tarig/his-logo.jpg" />

                <meta property="twitter:card" content="summary_large_image" />
                {/* <meta property="twitter:site" content={"@username"} /> */}
                <meta property="twitter:title" content={"Rent Nest | منصة ايجار عقارات داخل الاردن"} />
                <meta property="twitter:description" content={"منصة Rent Nest , تقدم خدمات و ايجار عقارات داخل دولة الاردن , حيث توجد عروض ايجار شاليهات و شقق و بيوت و سكن طلاب و سيارات."} />
                <meta property="twitter:image" content="https://f003.backblazeb2.com/file/personal-use-mot-tarig/his-logo.jpg" />

            </head>

            <body>
                <DataContext>
                    <MainWrapper children={children}/>    
                </DataContext>
            </body>

        </html>
    )
};

export default Layout;