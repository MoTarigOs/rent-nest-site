import { ProperitiesCatagories, VehicleCatagories } from "./Data";

const testCharacaters = 'ABCDEFGHIJKLMNOPQRSTUVWYZabcdefghijklmnopqrstuvwyz -!_*&%?.#+/@0123456789أابتثجحخدذرزعغلمنهويئسشصضطكفقةىءؤ';


export const getItemDetails = () => {
    return {
        title: 'this is title',
        desc: 'this is desc'
    }
}

export const getDesignedDate = (date) => {

};

export const isValidUsername = (name) => {

    let notAllowed = [];

    for (let i = 0; i < name.length; i++) {
        if(!testCharacaters.includes(name[i])){
            if(!notAllowed.find(item => item === name[i])) notAllowed.push(name[i]);
        }
    }

    if(notAllowed.length > 0){
        return { ok: false, dt: notAllowed }
    } else {
        return { ok: true, dt: '' };
    }

};

export const isValidEmail = (email) => {

    if(typeof email !== "string" || email.length < 5 || email.length > 45) return { ok: false };

    const regexPattern = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,})$/;

    if(!regexPattern.test(email))
      return { ok: false };
  
    return { ok: true };

};

export const isValidPassword = (ps) => {

    if(typeof ps !== "string" || ps.length < 8 || ps.length > 30) return { ok: false };

    for (let i = 0; i < ps.length; i++) {

        let passed = false;

        for (let j = 0; j < testCharacaters.length; j++) {
            if(ps[i] === testCharacaters[j]) 
                passed = true;
        }

        if(!passed) return { ok: false };

    };

    return { ok: true };

};

export const getArabicNameCatagory = (thisCatagory) => {
    const ct = ProperitiesCatagories.find(i => i.value === thisCatagory);
    if(ct) return ct.arabicName;
    const vct = VehicleCatagories.find(i => i.value === thisCatagory);
    if(vct) return vct.arabicName;
    return 'كل التصنيفات';
};

export const arrangeArray = (type, arr) => {

    switch(type){
        
        case 'default':
            return arr;

        case 'address':
            return arr;
        case 'ratings':
            return arr;
        case 'low-price':
            return arr;
        case 'high-price':
            return arr;
        default:
            return arr;   
             
    }
    
};