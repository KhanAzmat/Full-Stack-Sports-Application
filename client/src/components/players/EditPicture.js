import { useRef, useState } from "react"
import AvatarEditor from "react-avatar-editor"
import { Backdrop, Box, Slider, Button, Grid } from "@mui/material"

const EditPicture = ({ image, open, onCrop })=>{
    const [openCrop, setOpenCrop] = useState(open)
    const [scale, setScale] = useState(1)
const EditorRef = useRef()


    const handleScaleChange = (e, newValue)=>{
        setScale(newValue)
    }

    const handleSave = ()=>{
        if(EditorRef){
            const canvas = EditorRef.current.getImage()
            canvas.toBlob((blob)=>{
                let file  = new File([blob], 'image.jpg', {type:'image/jpeg'})
                onCrop(file) 
            }, 'image/jpeg')
            
            
            // onCrop(canvas.toDataURL('image/jpg'))
            handleClose()
           
        }
    }

    const handleClose = ()=>{
        setOpenCrop(false)
    }
    return <> 
    <Backdrop open={openCrop} sx={{zIndex:theme=>theme.zIndex.tooltip+2}}>
        <Grid container display='flex' flexDirection='row' justifyContent='center'>
            <Grid item>
    <AvatarEditor 
ref={EditorRef}
image={image}
// image = 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg'
width={450}
height={450}
border={150}
borderRadius={250}
scale={scale}/>
</Grid>

<Grid item display='flex' justifyContent='center' alignContent='center'>
<Grid sx={{ml:-5}} spacing={10} container display='flex' flexDirection='column'  justifyContent='center' alignContent='start'>
<Grid item height='50vh'>
<Slider  orientation="vertical" value={scale} min={1} max={2} step={0.01} onChange={handleScaleChange}  defaultValue={1}/>
</Grid>
<Grid item>
<Button variant="contained" onClick={handleSave}>Save</Button>
</Grid>
</Grid>
</Grid>

</Grid>
</Backdrop>
    </>
}

export default EditPicture