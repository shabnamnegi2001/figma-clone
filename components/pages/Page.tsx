import React, { useEffect } from 'react'

export default function Page({page, onPageSelect, activePage, deletePageFromStorage}) {
  const isActive = (value: string) =>
    (activePage && activePage === value);  

  useEffect(()=> {
  console.log('activePage in page:', activePage);
  }, [activePage]
  )

  return (
    <div onClick={() => onPageSelect(page.label)} 
    className={` group my-1 flex h-10 justify-between items-center gap-2 px-5 py-2.5 w-full hover:cursor-pointer 
      ${isActive(page.label) ? "bg-primary-green text-primary-black" : "hover:bg-primary-grey-200 text-primary-grey-300"}
      `}>

    <span>{page.label}</span>
      
    <button onClick={(e) => {e.stopPropagation(); deletePageFromStorage(page.pageId); }}
    // onClick={deletePageFromStorage(page.pageId)}
       className="text-xs flex justify-center bg-primary-grey-300 text-primary-black h-4 w-4 rounded-xl" >x</button>
        
    </div>
  )
   
}




