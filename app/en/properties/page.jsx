'use client'

import '../../properties/Properties.scss';
import { Suspense, useContext, useEffect, useState } from "react";
import { Context } from "@utils/Context";
import { ProperitiesCatagories } from "@utils/Data";
import { useSearchParams } from "next/navigation";
import PropertiesArray from "@components/PropertiesArray";
import PageFilterHeader from '@components/PageFilterHeader';

const Page = () => {

    const catagoryParam = useSearchParams().get('catagory');
    const cardsPerPage = 16;

    const { 
        setCatagory
    } = useContext(Context);

    useEffect(() => {
        if(ProperitiesCatagories.find(i => i.value === catagoryParam)){
            setCatagory(catagoryParam);
        }
    }, [catagoryParam]);

  return (
    <div className="properitiesPage" dir="ltr">

        <PageFilterHeader isEnglish/>

        <PropertiesArray isEnglish type={'properties'} cardsPerPage={cardsPerPage} catagoryParam={catagoryParam}/>

    </div>
  )
}

const SuspenseWrapper = () => (
	<Suspense>
		<Page />
	</Suspense>
);

export default SuspenseWrapper;
