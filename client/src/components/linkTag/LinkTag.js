import React, { useEffect, useState } from "react";
import { Fab, Tooltip, Grid, Card, Divider, LinearProgress, Button } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import {
  Add,
  LinkOutlined,
  LocalOfferOutlined,
  LocalMallOutlined,
  LocalShippingOutlined,
  PeopleOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import AuthAppBar from "../UI/AuthAppBar";
import { getLinkedTags, deleteLinkedTag } from "../../_actions/linkedTagAction";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link, Redirect } from "react-router-dom";
import NotAvailable from "../UI/NotAvailable";
import Confirm from "../UI/Confirm";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "200px",
    
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
}));

const LinkTag = ({ getLinkedTags, linkedTags,deleteLinkedTag, role }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [delId, setDelId] = useState("");

  useEffect(() => {
    getLinkedTags();
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();

  const onDeleteOpen = (id) => {
    setConfirmDelete(true);
    setDelId(id);
  };

  const onDeleteClose = () => {
    setConfirmDelete(false);
  };
  const onDeleteHandler = () => {
    deleteLinkedTag(delId);
    onDeleteClose();
  };

  const titleIcon = <LinkOutlined color='primary' fontSize='large' />;
  if (role === "user") {
    return <Redirect to='/' />;
  }
  return (
    <div>
      <AuthAppBar title='Linked Tags' icon={titleIcon} />
      <Button
        variant='outlined'
        color='primary'
        component={Link}
        to='/config'
        className='mr-2'
      >
        Configuration
      </Button> <br/> <br/>
      {confirmDelete && (
        <Confirm
          open={confirmDelete}
          onClose={onDeleteClose}
          onConfirm={onDeleteHandler}
          title='Confirm Delete?'
          content='Warning! Delete cannot be reversed.'
          handleOpen={onDeleteOpen}
        />
      )}

      <Tooltip title='Link a Tag'>
        <Fab
          color='primary'
          aria-label='add'
          component={Link}
          to='/addLinkTag'
          className={classes.fab}
          size='large'
        >
          <Add />
        </Fab>
      </Tooltip>

      {linkedTags && linkedTags.length > 0 ? (
        <Grid container spacing={1}>
          {linkedTags &&
            linkedTags.map((lt) => (
              <Grid item className={classes.root}>
                <Card className='p-3 mr-5'>
                  <LocalOfferOutlined fontSize='small' color='primary' />{" "}
                  <span style={{ fontSize: "20px" }}>
                    {lt.tag && lt.tag.tagId}
                  </span>
                  <br /> <br /> <Divider light='true' variant='middle' /> <br />
                  {(() => {
                    if (lt.elementType === "Item") {
                      return (
                        <React.Fragment>
                          <LocalMallOutlined fontSize='small' />
                          {lt.item && lt.item.name}
                        </React.Fragment>
                      );
                    } else if (lt.elementType === "Asset") {
                      return (
                        <React.Fragment>
                          <LocalShippingOutlined fontSize='small' />{" "}
                          {lt.asset && lt.asset.name}
                        </React.Fragment>
                      );
                    } else {
                      return (
                        <React.Fragment>
                          <PeopleOutlined fontSize='small' />{" "}
                          {lt.employee && lt.employee.name}
                        </React.Fragment>
                      );
                    }
                  })()}
                  <br />
                  <CardActions>
                    <IconButton onClick={() => onDeleteOpen(lt._id)} size="large">
                      {
                        <Tooltip title='Delete'>
                          <DeleteOutline className='text-danger' style={{marginLeft: '-20px', marginBottom: '-20px'}} />
                        </Tooltip>
                      }
                    </IconButton>
                    
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      ) : (
        <div className={classes.spinner}>
          <LinearProgress />
          <NotAvailable component='Linked Tags' />
        </div>
      )}
    </div>
  );
};

LinkTag.propTypes = {
  getLinkedTags: PropTypes.func.isRequired,
  linkedTags: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  linkedTags: state.linkedTag.linkedTags,
  role: state.auth.role,
});

export default connect(mapStateToProps, {
  getLinkedTags,deleteLinkedTag
})(withRouter(LinkTag));
