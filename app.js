const express = require('express');
const app = express();
const userModel = require('./models/user'); 
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

// Set up middleware
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('index'); // Ensure 'index.ejs' exists in the 'views' folder
});

app.post('/create', (req,res) => {
    let {username,email,password,phone} = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                username: username,
                email: email,
                password: hash
            });

            let token = jwt.sign ({email}, 'shhhhhh');
            res.cookie("token",token);
            res.render("login");
    })
})
});

app.get('/login', (req, res) => { 
    res.render('login'); 
});

app.post('/login', async (req, res) => { 
    let user = await userModel.findOne({email: req.body.email}) ;
    if(!user) return res.send("User not found");

    bcrypt.compare(req.body.password,user.password, (err, result) => {

       if(result){
        let token = jwt.sign({email: user.email}, 'shhhhhh');
        res.cookie("token", token); 
        res.render("found");

       }
         else res.render("notfound");
    })
});

app.get('/logout', (req, res) => { 
    res.cookie("token", "");
    res.redirect('/');
})      


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});