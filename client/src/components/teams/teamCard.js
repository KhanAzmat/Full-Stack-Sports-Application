import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material"
import EditAddTeam from "./buttonGroup"
import { useState } from "react"

const TeamCard = ({ team, editTeam })=>{
    // const [image, setImage]= useState(team.image? `/uploads/playerImage/${team.image}`:null)
    const handleDelete = ()=>{
        console.log('Handle Delete')
    }

    return  <Card elevation={3} sx={{ borderRadius:'1vw', m:'2vw', pr:'5.5%'}}> 
                <Grid container flexDirection='row' justifyContent='center' alignContent='center'>
                    <Grid item xs={1.8} >
                    <CardMedia
            component="img"
            height="100"
            src={team.image? `/uploads/teamImage/${team.image}`:`/static/media/basketball-players.png`}
            alt="logo"
            sx={{objectFit:'fill', }}
          />
                    </Grid>
                    <Grid item xs={4.2}>
                    <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {team.name}
            </Typography>
            <Typography variant="body2" >
              {team.location}
            </Typography>
          </CardContent>
                    </Grid>

                    <Grid item xs={6} display='grid' justifyContent='end' alignContent='start'>
                        <EditAddTeam team={team}/>
                    </Grid>
                </Grid>      
    </Card>
}

export default TeamCard