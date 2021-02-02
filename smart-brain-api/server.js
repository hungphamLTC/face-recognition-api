import express, { response } from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';
import {handleRegister} from './controllers/register.js';
import {handleSignIn} from './controllers/signin.js';
import {handleProfile} from './controllers/profile.js';
import {handleImage, handleApiCall} from './controllers/image.js';
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
//const port = 3000;

app.use(express.json());
app.use(cors());


// Sign in function 
app.post('/signin', (req, res)=> {handleSignIn(req, res, db, bcrypt)});

// register function
app.post('/register', (req, res) => {handleRegister(req, res, db, bcrypt)});

// showing user profile function
app.get('/profile/:id', (req, res)=> {handleProfile(req, res, db)});

// update function when user post an image for the website to recognizing faces.
app.put('/image', (req, res)=>{handleImage(req, res, db)});

// api call 
app.post('/imageurl', (req, res)=>{handleApiCall(req, res)});

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`App is running on port ${process.env.PORT}`);
});

