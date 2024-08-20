import CursorSVG from "@/public/assets/CursorSVG";

type props = {
  color: string;
  x: number;
  y: number;
  message: string;
}
const Cursor = ({color, x, y, message}:props) => {
  return (
    <div className="pointer-events-none absolute top-0 left-0" style={{transform: `translateX(${x}px) translateY(${y}px)`}}> 
    <CursorSVG color={color}/>

    {/* {Message} */}
    </div>
  )
}

export default Cursor
