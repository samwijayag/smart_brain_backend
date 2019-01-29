const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password: 'test',
    database : 'smart-brain'
  }
});


const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			email: 'john@gmail.com',
			name: 'john',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			email: 'jam@mail.com',
			name: 'jam',
			entries: 0,
			joined: new Date()
		}
	]
}

app.get('/', (req,res) => {
	res.send(database.users)
})


app.post('/signin', (req,res) => {
	if(req.body.email === database.users[0].email && 
		req.body.password === database.users[0].password) {
		res.json('success');		
	} else {
		res.status(400).json('Error logging in');
	}
})

app.post('/register', (req,res)=> {
	const {email,name,password} = req.body;
	db('users') 
	.returning('*')
	.insert({
		email: email,
		name: name,
		joined: new Date()
	})
	.then(user => {
		res.json(user[0])	
	})
	.catch(err => res.status(400).json('unable to register'))
})


app.get('/profile/:id', (req,res)=>{
	const {id} = req.params;
	let found = false
	database.users.forEach(user => {
		if(user.id=== id){
			found = true
			return res.json(user)
		}
	})
	if(!found){
		res.status(400).json('user invalid')
	}
})

app.put('/image',(req,res)=>{
	const {id} = req.body;
	let found = false
	database.users.forEach(user => {
		if(user.id=== id){
			found = true;
			user.entries++
			return res.json(user.entries)
		}
	})
	if(!found){
		res.status(400).json('user invalid')
	}
})



app.listen(3000, () => {
	console.log('app is ready')
} )


/*
/ --> res = this is working
/signing --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/