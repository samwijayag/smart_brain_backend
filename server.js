const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
	console.log(req.body.email);
	console.log(req.body.password);
})

app.post('/register', (req,res)=> {
	const {email,name,password} = req.body;
	bcrypt.hash(password, null, null, function(err, hash) {
    	console.log(hash);
	});
	database.users.push({
		id: '132',
		email: email,
		name: name,
		password: password,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1])
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

app.post('/image',(req,res)=>{
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
 
// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


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