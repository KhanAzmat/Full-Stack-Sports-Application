import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import EditIcon from '@mui/icons-material/Edit';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import TeamForm from './teamForm';
import ConfirmDelete from './confirmDelete';
import SelectPlayer from './selectPlayer';

const EditAddTeam = ({team})=>{
    const [openTeamEdit, setOpenTeamEdit] = useState(false)
    const [openAddPlayer, setOpenAddPlayer] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [toDelete, setToDelete] = useState('')

    const buttonArray = [
        {
            label : 'Add',
            icon : <GroupAddIcon style={{fontSize:'200%'}}/>
        },
        {
            label : 'Edit',
            icon : <EditIcon style={{fontSize:'200%'}}/>
        },
        {
            label : 'Delete',
            icon : <DeleteIcon style={{fontSize:'200%'}}/>
        }

        
    ]

    const handleClick = (el)=>{
        if(el.label === 'Edit')
            setOpenTeamEdit(true)
        else if(el.label === 'Add')
            setOpenAddPlayer(true)
        else
            {
                setToDelete(team)
                setConfirmDelete(true)
            }
    }

    const closeForm = ()=>{
        setOpenTeamEdit(false)
    }

    const closeConfirm = ()=>{
        setConfirmDelete(false)
    }

    const closeAddPlayer= ()=>{
        setOpenAddPlayer(false)
    }

    return <>
        {openTeamEdit && <TeamForm open={openTeamEdit} onClose={closeForm}  team={team}/>}

        {confirmDelete && <ConfirmDelete open={confirmDelete} team={toDelete} onClose={closeConfirm}/>}

        {openAddPlayer && <SelectPlayer open={openAddPlayer} onClose={closeAddPlayer} team={team}/>}

        <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{width:'125%', height:'170%',}} >
          {buttonArray.map(el=> <Button variant='contained' startIcon={el.icon} sx={{width:'75%', borderRadius:0, fontSize:'150%'}} onClick={()=>handleClick(el)}></Button>)}
          {/* {buttonArray.map(el=> <IconButton size='large' >{el.icon}</IconButton>)} */}
        </ButtonGroup>
        </>
}

export default EditAddTeam

