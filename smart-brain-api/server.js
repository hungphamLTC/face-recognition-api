import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


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
    console.log(req.body);
    if(req.body.email === database.users[1].email && req.body.password === database.users[1].password){
        res.json(database.users[1]);
    }else{
        res.status(400).json("wrong password");
    }
});

app.post('/register', (req, res)=>{
    const {name, email, password} = req.body;
    console.log(req.body)
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req, res)=>{
    const {id} = req.params;
    let found = false;
    database.users.forEach(user=>{
        if(user.id === id){
            found = true;
            return res.json(user);
        }
    })
    if(!found){
        res.status(400).json("user not found");
    }
});

app.put('/image', (req, res)=>{
    const {id} = req.body;
    let found = false;
    database.users.forEach(user=>{
        if(user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })

    if(!found){
        res.status(400).json("user not found");
    }
});


app.listen(port, ()=>{
    console.log(`App is running on port ${port}`);
});

//console.log(app);