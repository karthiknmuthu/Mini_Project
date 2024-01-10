const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1/reviews", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const reviewSchema = new mongoose.Schema(
  {
    location_id: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    comments: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
app.post("/reviews", (req, res) => {
  const { location_id, rating, comments } = req.body;
  const review = new Review({ location_id, rating, comments });
  review
    .save()
    .then(() => res.json("Review added!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

app.get("/reviews/:location_id", (req, res) => {
  const location_id = req.params.location_id;
  Review.find({ location_id })
    .then((reviews) => res.json(reviews))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
