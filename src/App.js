import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Grid, CssBaseline } from '@material-ui/core';
import Map from './components/Map/Map';
import Header from './components/Header/Header';
import PlaceDetails from './components/PlaceDetails/PlaceDetails';
import { getPlacesData } from './api';
import Home from './home';
import axios from 'axios';
import Lists from './components/Lists/Lists';
import homeapi from './api/homeapi';

const App = () => {
  const [places, setPlaces] = useState([]);
  const [type, setType] = useState('attractions');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  
  const [autocomplete, setAutocomplete] = useState(null);
  const [rating, setRating] = useState('');
  const [coords, setCoords] = useState({});
  const [bounds, setBounds] = useState(null);
  const [isPageVisible, setPageVisibility] = useState(false);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const destination = localStorage.getItem("des");
 
  useEffect(() => {
  const getCityData = async (cityName) => {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=eb6d330ed67945a9b21aa7d8968aea4b`);
     
     const lati=(response.data.results[0].geometry.lat)
     const longi=(response.data.results[0].geometry.lng)
     
      await setCoords({ lat: lati, lng: longi })
    if(response.status===200){
       localStorage.removeItem('des')
     }
     
    } catch (error) {
      console.error(error);
    }
  };

    if(destination){
      getCityData(destination)
    }
   else{
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoords({ lat: latitude, lng: longitude });
    });}
  }, [destination]);

  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);

    setFilteredPlaces(filtered);
  }, [rating]);

  useEffect(() => {
    if (bounds) {
    setIsLoading(true);
    getPlacesData(type,bounds?.sw, bounds?.ne).then((data) => {
      console.log(data);
      setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
      setFilteredPlaces([]);
      setIsLoading(false);
    }); }
  }, [ bounds,type]);
  console.log(places)
  console.log("ans",filteredPlaces)

  const togglePageVisibility = () => {
    setPageVisibility((prevVisibility) => !prevVisibility);
  };
  
  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoords({ lat, lng });
  };
  return (
<>
    
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/place" element={<PlaceDetails />} />
        <Route
          path="/map"
          element={
            <Grid container spacing={3} style={{ width: '100%' }}>
            <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} togglePageVisibility={togglePageVisibility} />

              {isPageVisible && (
                <Grid item xs={12} md={4}>
                  <Lists  places={filteredPlaces.length ? filteredPlaces : places}
                   isLoading={isLoading}
            childClicked={childClicked}
            type={type}
            coords={coords}
            setCoords={setCoords}
            setType={setType}
            rating={rating}
            setRating={setRating}
                   />
                </Grid>
              )}
              <Grid item xs={12} md={isPageVisible ? 8 : 12}>
                <Map
                  setCoords={setCoords}
                  setBounds={setBounds}
                  bounds={bounds}
                  setChildClicked={setChildClicked}
                  coords={coords}
                 
            places={filteredPlaces.length ? filteredPlaces : places}
         

                />
              </Grid>
            </Grid>
          }
        />
      </Routes>
   </>
  );
};

export default App;
