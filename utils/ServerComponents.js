'use server';

import { cookies } from "next/headers";

export const isLoginedCookie = async() => {
    const cookie = cookies().get('is_logined');
    return cookie?.value === 'true';
}

export const isPreviouslyLogined = async() => {
    const cookie = cookies().get('is_logined');
    return cookie?.value?.length > 0;
}