// @ts-nocheck
"use client"; 

import { fabric } from "fabric";

import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleCanvasMouseDown, handleCanvasMouseUp, handleCanvasObjectModified, handleCanvasSelectionCreated, handleResize, initializeFabric, renderCanvas, handleCanvasObjectScaling, handlePathCreated, handleCanvaseMouseMove } from "@/lib/canvas";
import { ActiveElement, Attributes } from "@/types/type";
import { useMutation, useRedo, useStorage, useUndo } from "@liveblocks/react";
import { defaultNavElement } from "@/constants";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { handleImageUpload } from "@/lib/shapes";

export default function Page() {
  const undo = useUndo();
  const redo = useRedo();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null)
  const activeObjectRef = useRef<fabric.Object| null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef(false);

  const activePageRef = useRef('page 0');

  const [activePage, setActivePage] = useState('page 0')

  const canvasObjects = useStorage((root) => root.
canvasObjects)

const canvasPages = useStorage((root) => root.
canvasPages)

useEffect(()=> {
  activePageRef.current = activePage;
}, [activePage], canvasPages)

const [elementAttributes, setElementAttributes] = useState<Attributes>({
  width:'',
  height:'',
  fontSize:'',
  fontFamily:'',
  fontWeight:'',
  fill:'#aabbcc',
  stroke:'#aabbcc',
  rx: '0',
  ry:'0'
})


const syncShapeInStorage = useMutation(({storage},
  object) => {
    if (!object) return;
  
    const { objectId } =  object;
    const shapeData = object.toJSON();
    shapeData.page = activePageRef.current;
    shapeData.objectId = objectId;
    const canvasObjects = storage.get('canvasObjects');
    canvasObjects.set(objectId , shapeData)
  },[] )

  const syncPageInStorage = useMutation(({storage},
    object) => {
      if (!object) return;

      console.log(`object name here is : ${object}`);
      // const shapeData = object.toJSON();
      const {pageId} = object;
      const canvasPages = storage.get('canvasPages');
      canvasPages.set(pageId , object)
    },[canvasPages] )
  

  //   const [pages, setPages] = useState([{pageId : '0' ,label :'page 0'}]);

  // const addPage = () => {
  //   setPages((prev) => {
  //    syncPageInStorage({pageId : `${prev.length}` ,label :`page ${prev.length}`}); 
  //     return [...prev, {pageId : `${prev.length}` ,label :`page ${prev.length}`}];
  //     })
  // }

const [pages, setPages] = useState([{pageId :`${Date.now()}` ,label :'page 0'}]);
// const index = useRef(1);
const addPage = () => {
  
  setPages((prev) => {
    let temp_array=prev?.filter(value=>/^page \d/.test(value.label)).sort((a, b) => (parseInt(a.pageId) - parseInt(b.pageId)));
    let next_index;
    let last_page  =   temp_array.at(-1)
   
    if(last_page)
      next_index=  parseInt(last_page['label'].split(' ')[1]) + 1  
    else
      next_index=0;  
    let id = Date.now()
    syncPageInStorage({pageId : `${id}` ,label : `page ${next_index}`});
    return [...prev, {pageId : `${id}` ,label : `page ${next_index}`}];
    })
}

  useEffect(() => {
    if(!canvasPages) return;

let sortedPages = Array.from(canvasPages, ([pageId, page ]) => {
  return page;
    }).sort((a, b) => (parseInt(a.pageId) - parseInt(b.pageId)) ); 


  setPages(() =>
    [...sortedPages]
    )

  if(!sortedPages.length){
    addPage();
  }
  
  else{
    if(!sortedPages.find((val) => val.label == activePage))
      setActivePage(sortedPages[0].label)
  }
   
  

  }, [canvasPages])

  const [activeElement, setActiveElement] =  useState<ActiveElement>({
    name: '',
    value: '',
    icon: ''
  })

  const deleteAllPages = useMutation(({storage}) => {
    const canvasPages = storage.get('canvasPages')

    if(!canvasPages || canvasPages.size === 1) 
      return true;

    for (const [key, value] of canvasPages.entries()) {
      canvasPages.delete(key)
    }

    return canvasPages.size === 1;
  }, [])

  const deleteAllShapes = useMutation(({storage}) => {

    const canvasObjects = storage.get('canvasObjects')

    if(!canvasObjects || canvasObjects.size === 0) 
      return true;

    for (const [key, value] of canvasObjects.entries()) {
      canvasObjects.delete(key)
    }

    return canvasObjects.size === 0;

  }, [])

  const deleteShapeFromStorage = useMutation(({
    storage }, objectId) => {
    const canvasObjects = storage.get('canvasObjects');
  
    canvasObjects.delete(objectId);
  }, [])

  const deletePageFromStorage = useMutation(({
    storage}, page) => {
      const canvasObjects = storage.get('canvasObjects')
      const canvasPages = storage.get('canvasPages')
      console.log('page is deleted');
      canvasPages.delete(page.pageId);

      Array.from(canvasObjects || [], ([objectId, objectData]) => {
        
        if(objectData.page == page.label){
          deleteShapeFromStorage(objectId)
        }
      })
     

  }, [])
  
  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);

    switch (elem?.value) {
      case 'reset':
        deleteAllShapes();
        deleteAllPages();
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement);
        break;

       case 'delete': 
        handleDelete(fabricRef.current as any, 
        deleteShapeFromStorage)
        setActiveElement(defaultNavElement )
        break;

        case 'image':
        imageInputRef.current?.click();
        isDrawing.current = false;

        if(fabricRef.current) {
          fabricRef.current.isDrawingMode = false;
        }
        break;

        default:
          break;
    }

    selectedShapeRef.current = elem?.value as string
  }

useEffect(() => {
  // if (!canvasRef.current || !fabricRef.current) return;

  const canvas = initializeFabric({canvasRef, fabricRef})

  canvas.on("mouse:down", (options:any) => {
    handleCanvasMouseDown({
      options, 
      canvas,
      isDrawing,
      shapeRef,
      selectedShapeRef,
    })
  })

  canvas.on("mouse:move", (options:any) => {
    handleCanvaseMouseMove({
      options, 
      canvas,
      isDrawing,
      shapeRef,
      selectedShapeRef,
      syncShapeInStorage
    })

  })

  canvas.on("mouse:up", (options:any) => {
    handleCanvasMouseUp({
      options, 
      canvas,
      isDrawing,
      shapeRef,
      selectedShapeRef,
      syncShapeInStorage,
      setActiveElement,
      activeObjectRef,
    })

  })

  canvas.on("object:modified", (options:any) =>  {
    handleCanvasObjectModified({
       options,
       syncShapeInStorage,
       })
  })

  canvas.on("selection:created", (options:any) => {
    handleCanvasSelectionCreated({
      options,
      isEditingRef,
      setElementAttributes
    })
  })

  canvas.on("object:scaling", (options:any) => {
    handleCanvasObjectScaling({
      options, setElementAttributes, syncShapeInStorage
    })
  })  

  canvas.on("path:created", (options:any) => {
    handlePathCreated({
      options, syncShapeInStorage
    })
  }) 

  window.addEventListener("resize", ()=> {
    handleResize({fabricRef})
  }) 

  window.addEventListener("keydown", (e:any) => {
    handleKeyDown({
      e, 
      canvas: fabricRef.current,
      undo, 
      redo,
      syncShapeInStorage,
      deleteShapeFromStorage
    })
  })

  return () => {
    canvas.dispose();
  }

}, [])  

useEffect(() => {
  renderCanvas({ 
    fabricRef, 
    canvasObjects, 
    activeObjectRef,
    activePage,
  })
}, [canvasObjects, activePage])

  return (
  <main className="h-screen overflow-hidden">
      <Navbar 
      activePage={activePageRef}
      activeElement={activeElement}
      handleActiveElement={handleActiveElement}
      imageInputRef={imageInputRef}
      handleImageUpload={(e:any) => {
        e.stopPropagation();

        handleImageUpload({ 
        file: e.target.files[0], 
        canvas:fabricRef as any, 
        shapeRef, 
        syncShapeInStorage,})
      }}
      />

      <section className="flex h-full flex-row ">
        <LeftSidebar allShapes={Array.from(canvasObjects || [])} activePage={activePage} setActivePage={setActivePage} pages={pages} addPage={addPage} deletePageFromStorage={deletePageFromStorage} />
        <Live canvasRef={canvasRef} undo={undo} redo={redo} activePage={activePage}/>
        <RightSidebar 
        elementAttributes={elementAttributes}
        setElementAttributes={setElementAttributes}
        fabricRef={fabricRef}
        isEditingRef= {isEditingRef}
        activeObjectRef={activeObjectRef}
        syncShapeInStorage={syncShapeInStorage}
        />
      </section>

    </main>
  );
}  


