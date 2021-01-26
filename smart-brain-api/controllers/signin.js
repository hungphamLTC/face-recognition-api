const handleSignIn = (req, res, db, bcrypt)=>{
    const {email, password} = req.body; // getting email and password entered by user
    db.select('email', 'hash').from('login').where({email: email}) // connect to database and compare emails
        .then(data => { // if email is valid, then compare password
            const isValid = bcrypt.compareSync(password, data[0].hash); // comparing password using bcrypt npm
            if(isValid){  // if password is matched, return the user profile
                return db.select('*').from('users').where('email', '=', email)
                        .then(user => {
                            res.json(user[0])
                        })
                        .catch(err => res.status(400).json('unable to get user'))
            }else{
                res.status(400).json('Wrong password or username')
            }
        })
        .catch(err=> res.status(400).json('wrong password or username'))
}

export {handleSignIn};