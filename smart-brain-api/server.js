import express, { response } from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';
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

// db.select('*').from('users').then(data=>{
//     console.log(data);
// });

const database = {
    users: [
        {
            id: '123',
            name: 'Johanna',
            email: 'johanna@gmail.com',
            password: 'johanna',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Mikko',
            email: 'Mikko@gmail.com',
            password: 'Mikko',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res)=>{
    //console.log(database.users[0].email, database.users[0].password);
    res.send(database.users);
});

app.post('/signin', (req, res)=>{
    const {email, password} = req.body;
    db.select('email', 'hash').from('login').where({email: email})
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash); 
            if(isValid){
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

app.post('/register', (req, res)=>{
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx=>{
        console.log('trx', trx);
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail=>{
            console.log('loginEmail', loginEmail);
            return trx('userss')
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0], 
                joined: new Date()
            }).then(user=> {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json(err));
    
});

app.get('/profile/:id', (req, res)=>{
    const {id} = req.params;
    //let found = false;
    // database.users.forEach(user=>{
    //     if(user.id === id){
    //         found = true;
    //         return res.json(user);
    //     }
    // })
    db.select('*').from('users').where({id: id}).then(user=>{
        if(user.length){
            res.json(user[0]);
        }else{
            res.status(400).json('Not found');
        }
        
    }).catch(err=> res.status(400).json(err));
    // if(!found){
    //     res.status(400).json("user not found");
    // }
});

app.put('/image', (req, res)=>{
    const {id} = req.body;
    db('users')
  .where('id', '=', id)
  .increment('entries',1)
  .returning('entries')
  .then(data=>{
      res.json(data[0]);
      console.log(data[0]);
  })
  .catch(err => res.status(400).json('cannot updates'));
});


app.listen(port, ()=>{
    console.log(`App is running on port ${port}`);
});

//console.log(app);