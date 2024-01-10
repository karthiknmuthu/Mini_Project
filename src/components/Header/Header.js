import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import useStyles from './styles.js';
import '../PlaceDetails/PlaceDetails.css'

const Header = ({onPlaceChanged, onLoad,togglePageVisibility }) => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
      <FontAwesomeIcon icon={faEllipsisV} beat className={classes.icon} onClick={togglePageVisibility} />
        <div className='container' >
          Travel Pal
        </div>
        <Box display="flex">
          <Typography variant="h6" className={classes.title}>
            Explore new places
          </Typography>
          
        
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase placeholder="Search…" classes={{ root: classes.inputRoot, input: classes.inputInput }} />
            </div>
            </Autocomplete>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
