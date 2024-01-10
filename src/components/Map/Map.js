  import React, { useState, useEffect } from 'react';
  import GoogleMapReact from 'google-map-react';
  import { Paper, Typography, useMediaQuery, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
  import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
  import { BrowserRouter as Router, Routes, Route, Link,useNavigate } from "react-router-dom";
  import { Rating } from '@material-ui/lab';
  import axios from 'axios';
  import useStyles from './styles';
  import { handleReviewSubmit } from './Map';


  const Map = ({ setCoords, setBounds, coords, places,setChildClicked }) => {
    const classes = useStyles();
    const isdes = useMediaQuery('(min-width:600px)');
    const navigate = useNavigate();
    const [loc,setLoc]=useState(null)
    const [selectedPlace, setSelectedPlace] = useState(null);
    
const [hoveredPlace, setHoveredPlace] = useState(null);
    const [disasterData, setDisasterData] = useState([]);
    const [reviews, setReviews] = useState({});
    const [ratings,setRatings]=useState(0)


    useEffect(() => {
    
      const fetchDisasterData = async () => {
        const response = await fetch(`https://api.gdacs.org/feeds/combined.json`);
        const data = await response.json();
        setDisasterData(data.alerts);
      };
      fetchDisasterData();
    }, []);

    const getDisasterInfo = (place) => {
      const disasters = disasterData.filter(
        (disaster) =>
          disaster.edxl.hasScope.includes('Public') &&
          disaster.edxl.info.area.areaDesc.toLowerCase().includes(place.name.toLowerCase())
      );
      return disasters.length > 0 ? `${disasters[0].edxl.info.event} - ${disasters[0].edxl.info.headline}` : ' Disaster free location';
    };

  

    const [openReviewDialog, setOpenReviewDialog] = useState(false);
    const [reviewText, setReviewText] = useState('');

    const handleReviewDialogOpen = () => {
    
      setOpenReviewDialog(true);
    };

    const handleReviewDialogClose = () => {
      setOpenReviewDialog(false);
      setReviewText('');
    };
    const handlePage=()=>{
    localStorage.setItem('lid',loc)
  navigate('/place');

      
    }

    const handleReviewSubmit = () => {
      if (selectedPlace) {
        axios.post(`http://localhost:5000/reviews`,{
          location_id:
          selectedPlace.location_id,
          rating:ratings,
          comments:reviewText
        })
        alert("Review Added")

        

        handleReviewDialogClose();
      }
    };

    return (
      <div className={classes.mapContainer}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'AIzaSyCb0wEH7fVGSAmr8XpKLkPFyH7h_ZLSiWg',
          }}
          defaultCenter={coords}
          center={coords}
          defaultZoom={14}
          margin={[50, 50, 50, 50]}
          options={''}
          onChange={(e) => {
            setCoords({ lat: e.center.lat, lng: e.center.lng });
            setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });

          }}
          onChildClick={(child) => setChildClicked(child)}
    
        >
          {places?.map((place, i) => (
            <div
              className={classes.markerContainer}
              lat={Number(place.latitude)}
              lng={Number(place.longitude)}
              onMouseEnter={() => setHoveredPlace(place)}
    onMouseLeave={() => setHoveredPlace(null)}
              onClick={()=>{setSelectedPlace(place); setLoc(place.location_id); localStorage.setItem('pic',place.photo.images.medium.url);  localStorage.setItem('res',JSON.stringify(place)); console.log(JSON.parse(localStorage.getItem('res')));console.log(loc,place.name)}}
  >        <LocationOnOutlinedIcon className={classes.markerIcon} />
{hoveredPlace === place && (
     <Paper elevation={3} className={classes.paper} style={{width: '150px', height: '200px', overflow: 'hidden' ,borderRadius:'10px'}}>
     <Typography className={classes.typography} style={{textAlign:"center"}}variant="subtitle2" gutterBottom>{hoveredPlace.name}</Typography>
     <Typography className={classes.typography} style={{textAlign:"center"}}variant="subtitle2" gutterBottom>{getDisasterInfo(place)}</Typography>
     <img className={classes.pointer}  src={hoveredPlace.photo ? hoveredPlace.photo.images.large.url : 'https://i.pinimg.com/736x/1a/9a/95/1a9a9548193ebdfb793e16f7c8fd53a0--national-holidays-places-to-visit-in.jpg'} style={{width: '90%', height: '60%', objectFit: 'cover',marginLeft:"5px"}} onError={(e) => { e.target.onerror = null; e.target.src = 'https://i.pinimg.com/736x/1a/9a/95/1a9a9548193ebdfb793e16f7c8fd53a0--national-holidays-places-to-visit-in.jpg'; }}/>
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Rating name="read-only" size="small" value={Number(hoveredPlace.rating)} readOnly />
</div>

   </Paper>
   
    )}
        </div>
      ))}
    </GoogleMapReact>
    
    {selectedPlace ? (
      <Dialog open={!!selectedPlace } onClose={() => setSelectedPlace(null)}>
        <DialogTitle>{selectedPlace.name}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom variant="subtitle2">
            {getDisasterInfo(selectedPlace)}
          </Typography>
          <img
            className={classes.dialogImage}
            src={
              selectedPlace.photo ? selectedPlace.photo.images.medium.url : 'https://i.pinimg.com/736x/1a/9a/95/1a9a9548193ebdfb793e16f7c8fd53a0--national-holidays-places-to-visit-in.jpg'
            }
            alt={selectedPlace.name}
          />
          <Typography gutterBottom variant="subtitle1">
          <Rating size="small" value={selectedPlace.rating} readOnly />
          </Typography>
          
          <Typography gutterBottom variant="subtitle1">
            Number of Reviews : {selectedPlace.num_reviews}
          </Typography>
          <Typography gutterBottom variant="subtitle1">
            Address: {selectedPlace.address}
          </Typography>
          
          <Button onClick={handleReviewDialogOpen} color="primary" variant="contained">
            Leave a review
          </Button>
          
          <Button style={ {marginLeft:"20px"} }onClick={handlePage} color="primary" variant="contained">
            View info
          </Button>
          <Dialog open={openReviewDialog} onClose={handleReviewDialogClose}>
            <DialogTitle>Leave a review</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                multiline
                rows={4}
                variant="outlined"
                label="Review"
                fullWidth
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <Rating size="small" value={ratings} precision={0.5}
                onChange={(e) => setRatings(e.target.value)} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleReviewDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleReviewSubmit} color="primary" variant="contained">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          {reviews[selectedPlace.place_id] && (
            <Paper elevation={3} className={classes.reviews}>
              {reviews[selectedPlace.place_id].map((review, i) => (
                <div key={i} className={classes.review}>
                  <Typography variant="subtitle2" gutterBottom>
                    {review}
                  </Typography>
                  
                </div>
              ))}
            </Paper>
          )}
        </DialogContent>
      </Dialog>
    ) : null}
  </div>
  );
  };


  export default Map;

