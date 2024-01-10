import React, { useState,createRef,useEffect} from 'react'
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';
import { BrowserRouter as Router, Routes, Route, Link,useNavigate } from "react-router-dom";
import useStyles from './styles'
import Info from '../Info/Info';

const Lists = ({places, type, setType, rating, setRating, childClicked, isLoading,setCoords}) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [elRefs, setElRefs] = useState([]);
    useEffect(() => {
      setElRefs((refs) => Array(places?.length).fill().map((_, i) => refs[i] || createRef()));
    }, [places]);
    const handleLogout = () => {
      localStorage.clear();
  
      navigate("/"); 
    };
  return (
    <div className={classes.container}>
<div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h4" style={{ marginRight: '16px' }}>Nearby Attractions</Typography>
      <button  style={{
      marginLeft: '16px',
      backgroundColor: '#e53935',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '16px',
      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
    }}onClick={handleLogout}>Logout</button>
    </div>
{isLoading ? (
        <div className={classes.loading}>
          <CircularProgress size="5rem" />
        </div>
      ) : (
        <>
<FormControl className={classes.formControl}>
            <InputLabel id="type">Type</InputLabel>
            <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
             
              <MenuItem value="attractions">Attractions</MenuItem>
              <MenuItem value="hotels">Restaurants</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="rating">Rating</InputLabel>
            <Select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
              <MenuItem value="0">All</MenuItem>
              <MenuItem value="3">Above 3.0</MenuItem>
              <MenuItem value="4">Above 4.0</MenuItem>
              <MenuItem value="4.5">Above 4.5</MenuItem>
            </Select>
          </FormControl>
          <Grid container spacing={3} className={classes.list}>
          {places?.map((place, i) => (
                <Grid ref={elRefs[i]} key={i} item xs={12}>
                <Info selected={Number(childClicked) === i} refProp={elRefs[i]} place={place} />
              </Grid>
))}

</Grid>
</>
      )}


        </div>
  )
}

export default Lists