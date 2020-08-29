const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "bb2bfac70b194b01b241c20028762e29",
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => { 
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const handleImage = (req, res, database) => {
  const { id } = req.body;
  database("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
