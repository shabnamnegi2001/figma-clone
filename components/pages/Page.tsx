import React, { useEffect } from 'react'

export default function Page({page, onPageSelect, activePage}) {
  const isActive = (value: string) =>
    (activePage && activePage === value);  

  useEffect(()=> {
  console.log('activePage in page:', activePage);
  }, [activePage]
  )

  return (
    <div onClick={() => onPageSelect(page.label)} 
    className={` group my-1 flex items-center gap-2 px-5 py-2.5 w-full hover:cursor-pointer
      ${isActive(page.label) ? "bg-primary-green" : "hover:bg-primary-grey-200"}
      `}>
        {page.label}
    </div>
  )
}




