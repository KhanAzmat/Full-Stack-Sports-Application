import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import RotateScreen from "../components/UI/RotateScreen"
import { useOrientation } from "react-use"

const CheckPortrait = ({children})=>{
    const { type, angle } = useOrientation()
    const [isPortrait, setIsPortrait] = useState(false)
    const height = useSelector(state=>state.dimension.height)
    const width = useSelector(state=>state.dimension.width)
    useEffect(()=>{
      // console.log('Angle : ', angle)
      console.log('Type : ', type)
      if(type === 'portrait-primary' || type === 'portrait-secondary')
        setIsPortrait(true)
      else if(type === 'landscape-secondary' || type === 'landscape-primary')
        setIsPortrait(false)
    },
    [type])
    // useEffect(()=>{
    //     if(height > width)
    //       setIsPortrait(true)
    //       else
    //       setIsPortrait(false)
    //   }, 
    //   [height, width])

    return <>
         { isPortrait && <RotateScreen open={isPortrait} width={width} height={height}/>}

         {!isPortrait && <div style={{touchAction:'none'}}>{children}</div>}
         {/* {children} */}
    </>
// return isPortrait ? (<RotateScreen open={isPortrait} width={width} height={height}/>) : (<div>{children}</div>)
}

export default CheckPortrait