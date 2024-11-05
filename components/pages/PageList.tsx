import React, { useState } from 'react'
import Page from './Page';

export default function PageList({activePage, setActivePage, pages ,addPage}) {

  return (
    <div>
    <div className="flex h-10 items-center justify-between">
    <span className="px-5 py-4 text-xs uppercase">Pages</span>
    <button className="text-xl flex items-center justify-end pr-4" onClick={addPage} >+</button>
    </div>
    <div className='flex h-auto items-center flex-col'>
    {
        pages.map((page) => {
            return (
             <Page key={page} page={page} activePage={activePage} onPageSelect={() => setActivePage(page.label)}
              /> 
                )
        })
    }
    </div>
    </div>
  )
}


