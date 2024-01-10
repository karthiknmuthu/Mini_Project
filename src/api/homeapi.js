import React from "react";
import axios from "axios";
const d = localStorage.getItem("des");
const homeapi = async () => {
  const options = {
    method: "GET",
    url: "https://geocoding-by-api-ninjas.p.rapidapi.com/v1/geocoding",
    params: { city: `${d}` },
    headers: {
      "X-RapidAPI-Key": "969a0e38a1msh54d83d095dda58ep1bc6b8jsn211fce39e881",
      "X-RapidAPI-Host": "geocoding-by-api-ninjas.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export default homeapi;
