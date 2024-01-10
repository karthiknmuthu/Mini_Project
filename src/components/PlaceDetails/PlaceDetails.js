import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, CardActions, Chip , Paper,  useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';
import { BrowserRouter as Router, Routes, Route, Link,useNavigate } from "react-router-dom";

import { Rating } from '@material-ui/lab';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './PlaceDetails.css';
import Map from '../Map/Map';

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBCarousel,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
} from 'mdb-react-ui-kit';

import SlickSlider from 'react-slick';

const PlaceDetails = () => {
  const [locationId, setLocationId] = useState('');
  const navigate = useNavigate();
  const [ratings,setRatings]=useState(0)
  const [profile,setProfile]=useState(null)
  const [reviews, setReviews] = useState([]);
  const [info,setInfo]=useState([]);

  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewText, setReviewText] = useState('');
 
  const handleReviewDialogOpen = () => {
   
    setOpenReviewDialog(true);
  };

   const handleReviewDialogClose = () => {
    setOpenReviewDialog(false);
    setReviewText('');
  };
 const fetchReviews = async () => {
  setProfile(localStorage.getItem('photo'))
      setLocationId(localStorage.getItem('lid'))
      setInfo(JSON.parse(localStorage.getItem('res')))
      console.log(info.address)
      try {
        const response = await axios.get(`http://localhost:5000/reviews/${locationId}`);
        setReviews(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  useEffect(() => {
   
    fetchReviews();
  }, [locationId]);

  const handleReviewSubmit = async  () => {
    
    await axios.post(`http://localhost:5000/reviews`,{
        location_id:
        info.location_id,
        rating:ratings,
        comments:reviewText
      })
      alert("Review Added")

        await fetchReviews();

      handleReviewDialogClose();
    
    
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    adaptiveHeight: true,
  };
  const backMap = () => {
   
    navigate("/map"); 
  };

  return (
    
    <MDBContainer fluid className="py-5 gradient-custom full-page-container">
      <button style={{
  position: 'absolute',
  top: '20px',
  right: '20px',
  backgroundColor: '#e53935',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '8px 16px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
}} onClick={backMap}>Map</button>

      <div className="place-details-container">
      <MDBCard className="info-card" style={{position: 'relative',
    marginLeft: '10%'}}>
      <MDBCardBody>
                    <MDBCardTitle style={{textAlign:'center',fontSize:'20px'}}>Place Information</MDBCardTitle>
                    <MDBCardTitle style={{textAlign:'center',fontSize:'20px'}}>{info.name}</MDBCardTitle>
                    <MDBCardImage style={{position: 'relative',width:'400px',height:'200x',borderRadius:"10px",marginLeft: '27%'}}
                    src={localStorage.getItem('pic') }
                    alt="place pic"
                    top
                    hover
                  />
                  <MDBCardText >Address: {info.address}</MDBCardText>
                  
   
                   
                    <Box display="flex" justifyContent="space-between">
                    <MDBCardText>More Info: {info.description}</MDBCardText>
        </Box>
                    <Box display="flex" justifyContent="space-between">
          <Typography component="legend">Ranking</Typography>
          <Typography gutterBottom variant="subtitle1">
            {info.ranking}
          </Typography>
        </Box>
                  </MDBCardBody>
      </MDBCard>
        <div className="review-slider-container " >
          <SlickSlider {...settings}>
            {reviews.map(review => (
              <MDBCarouselItem key={review._id}>
                <MDBCard className="review-card">
                <MDBCardTitle style={{textAlign:"center",fontSize:"16px"}}>Reviews</MDBCardTitle>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MDBCardImage style={{ width: '30px', height: '30px', marginRight: '10px' }}
                    src={localStorage.getItem('photo')}
                    alt="place"
                    top
                    hover  
                  /><span style={{ flexGrow: 1,fontWeight: "bold" }}>{localStorage.getItem('username')}</span></div>
                  <MDBCardBody>
                  
                  <div style={{ display: "block", alignItems: "center", margin: "10px 0" }}>
  <MDBCardText style={{ margin: "0 10px 0 0",marginLeft: "4px" }}>{review.comments}</MDBCardText>
  <Rating name="read-only" value={review.rating} readOnly />
  <MDBCardText style={{ margin: "0 0 0 10px" }}>{moment(review.createdAt).fromNow()}</MDBCardText>
</div>

                    <Button style={{marginLeft:'180px'}} onClick={handleReviewDialogOpen}>Add More review</Button>
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
                  </MDBCardBody>
                </MDBCard>
              </MDBCarouselItem>
            ))}
          </SlickSlider>
          {reviews.length === 0 && (
            <div >
              <MDBCard className="no-reviews-found">
             <MDBCardBody>
                   
             <MDBCardTitle style={{textAlign:'center',fontSize:'20px'}}>No reviews found <FontAwesomeIcon icon={faThumbsDown} /></MDBCardTitle>
                   <Button style={{marginLeft:'180px'}} onClick={handleReviewDialogOpen}>Add review</Button>
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
                  </MDBCardBody>
                </MDBCard>
              
            </div>
          )}
        </div>
      </div>
    </MDBContainer>
  );
}

export default PlaceDetails;
