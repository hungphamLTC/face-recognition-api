import express, { response } from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';

// declare db variable using knex npm
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'root',
      database : 'face-recognition-app'
    }
  });

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


// Sign in function 
app.post('/signin', (req, res)=>{
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
});

// register function
app.post('/register', (req, res)=>{
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
    
});

// showing user profile function
app.get('/profile/:id', (req, res)=>{
    const {id} = req.params; // getting user id from the link
    db.select('*').from('users').where({id: id}).then(user=>{
        if(user.length){ // if the user exists in the database, response the user profile to front-end side.
            res.json(user[0]);
        }else{
            res.status(400).json('Not found');
        }
        
    }).catch(err=> res.status(400).json(err));
});

// update function when user post an image for the website to recognizing faces.
app.put('/image', (req, res)=>{
    const {id} = req.body; // getting current user id state and using it to update to the database
    db('users')
  .where('id', '=', id)
  .increment('entries',1)
  .returning('entries')
  .then(data=>{
      res.json(data[0]);
  })
  .catch(err => res.status(400).json('cannot updates'));
});


app.listen(port, ()=>{
    console.log(`App is running on port ${port}`);
});

