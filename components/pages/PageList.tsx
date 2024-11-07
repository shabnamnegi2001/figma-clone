import React, { useState } from 'react'
import Page from './Page';

export default function PageList({activePage, setActivePage, pages ,addPage, deletePageFromStorage,}) {

  return (
    <div>
    <div className="flex h-10 items-center justify-between">
    <span className="px-5 py-4 text-xs uppercase">Pages</span>
    <button className="text-xl flex items-center justify-center mr-4 h-4 w-4 rounded-xl hover:bg-primary-grey-300 hover:text-primary-grey-200" onClick={addPage} >+</button>
    </div>
    <div className='flex h-auto items-center flex-col'>
    {
        pages.map((page) => {
            return (
             <Page key={page} page={page} activePage={activePage} deletePageFromStorage={deletePageFromStorage} onPageSelect={() => setActivePage(page.label)}
              /> 
                )
        })
    }
    </div>
    </div>
  )
}


