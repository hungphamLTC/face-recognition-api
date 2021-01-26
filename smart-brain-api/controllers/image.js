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

export {handleImage};