const handleRegister = (req, res, db, bcrypt)=>{
    const {name, email, password} = req.body; // getting information entered by user
    const hash = bcrypt.hashSync(password);
    db.transaction(trx=>{ // inserting to the dabase using transaction to ensure ACID principle
        trx.insert({ // insert to the login table first
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail=>{
            return trx('users') // do not forget to use return here.
            .returning('*')
            .insert({ // after inserting information to login table, then insert information to user table
                name: name,
                email: loginEmail[0], 
                joined: new Date()
            }).then(user=> {
                res.json(user[0]); // response user profile to front-end side
            })
        })
        .then(trx.commit) // commit the transaction to the database
        .catch(trx.rollback) // if something went wrong, do the roll back to keep the database consistency
    })
    .catch(err => res.status(400).json(err));
    
}

export {handleRegister};