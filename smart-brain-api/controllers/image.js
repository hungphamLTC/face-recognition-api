import clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'f09bbf1913184391852c6a1b21ea9db2'
 });

 const handleApiCall = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => {
    res.json(data);
  })
  .catch(err=> res.status(400).json('unable to work with API'));
 }


const handleImage = (req, res, db)=>{
    const {id} = req.body; // getting current user id state and using it to update to the database
    db('users')
  .where('id', '=', id)
  .increment('entries',1)
  .returning('entries')
  .then(data=>{
      res.json(data[0]);
  })
  .catch(err => res.status(400).json('cannot updates'));
}

export {handleImage, handleApiCall};