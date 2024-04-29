'use server';

// import { cookies } from "next/headers";

export const isLoginedCookie = async() => {
    return false;
    // const cookie = cookies().get('is_logined');
    // return cookie?.value === 'true' ? true : false;
}

export const isPreviouslyLogined = async() => {
    return false;
    // const cookie = cookies().get('is_logined');
    // return cookie?.value === 'false' ? true : false;
}