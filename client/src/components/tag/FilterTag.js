
import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 250,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function FilterTag() {
  const classes = useStyles();

  return <>
    <TextField
      variant="standard"
      autoFocus
      className={classes.input}
      placeholder='Search Tags'
      inputProps={{ "aria-label": "Search Tags" }}
      color='primary'
      helperText='Search using Tag ID, Date.' />
    <IconButton className={classes.iconButton} aria-label='search' size="large">
      <SearchIcon color='primary' />
    </IconButton>
  </>;
}
