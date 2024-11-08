'use client';

import { useEffect, useState } from "react";

const EmbeddedVideo = ({ url, isControl, isContain }) => {
    const [src, setSrc] = useState();
    
    const settingVideoSource = async() => {
        console.log('video url: ', url);
        const src8 = await fetch(url);
        const blob = await src8.blob();
        console.log('src8: ', blob);
        const finalUrl = URL.createObjectURL(blob);
        setSrc(finalUrl);
    };

    useEffect(() => {
        settingVideoSource();
    }, []);
    
    return <video style={{ objectFit: isContain ? 'contain' : undefined }} autoPlay loop controls={isControl} src={src}/>
};

export default EmbeddedVideo;
