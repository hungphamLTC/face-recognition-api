// this API GET profile only used and tested on POSTMAN, not connecting to front-end side yet.
const handleProfile = (req, res, db)=>{
    const {id} = req.params; // getting user id from the link
    db.select('*').from('users').where({id: id}).then(user=>{
        if(user.length){ // if the user exists in the database, response the user profile to front-end side.
            res.json(user[0]);
        }else{
            res.status(400).json('Not found');
        }
        
    }).catch(err=> res.status(400).json(err));
}

export {handleProfile};