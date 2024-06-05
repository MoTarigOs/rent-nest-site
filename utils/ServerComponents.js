'use server';

import axios from "axios";
import { cookies } from "next/headers";

export const isLoginedCookie = async() => {
    const cookie = cookies().get('is_logined');
    return cookie?.value === 'true';
}

export const isPreviouslyLogined = async() => {
    const cookie = cookies().get('is_logined');
    return cookie?.value?.length > 0;
}

export const getUserLocation = async() => {

    try {
        
        const url = 'https://freeipapi.com/api/json';

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(res.status === 200){
            return { 
                ok: true, 
                long: res.data.longitude, 
                lat: res.data.latitude, 
                city: res.data.cityName,
                principalSubdivision: '',
                locality: res.data.regionName
            };
        } else {
            
            const url2 = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
            
            const res2 = await axios.get(url2, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

            if(res2.status === 200){
                return {
                    ok: true, 
                    long: res2.data.longitude, 
                    lat: res2.data.latitude, 
                    city: res2.data.city,
                    principalSubdivision: res2.data.principalSubdivision,
                    locality: res2.data.locality 
                };
            }

        }

        return { long: null, lat: null, ok: false };
        
    } catch (err) {
        console.log(err.message);
        return { long: null, lat: null };
    }

};