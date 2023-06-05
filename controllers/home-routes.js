const router = require('express').Router();
const sequelize = require('../config/connection'); //i still need to require sequalize here so that i can use some of the different properties
const Blog = require('../models/blog');
const User = require('../models/user');
const BlogUser = require('../models/bloguser')
const Comment = require('../models/comment')
const {format_date, format_time} = require('../utils/helper')

//HOME PAGE
router.get('/', async (req, res) => { //this function is called in async because i have things after the call i make to the database
  //the call to the database takes time so the function will just skip and go to the next part
  try {
    const dbBlogUserData = await Blog.findAll({
      include: [
        {
          model: Comment,
        },
        {
          model: User,
          through: BlogUser,
        },
      ],
    }) //gets all the data async
    const blogs = dbBlogUserData.map((blog) => {
      const formattedBlog = blog.get({ plain: true });
      formattedBlog.createdAt = format_date(formattedBlog.createdAt);
      formattedBlog.comments.forEach(comment => {
        comment.createdAt = format_date(comment.createdAt);
      })
      return formattedBlog;
    });

    if(req.session.loggedIn){
      console.log(blogs)
      res.render('homepage', { //this renders a template, the file structure is very importiant when using templates this line of code can really only work in a views folder
        
        loggedIn: req.session.loggedIn,
        blogs, //this second argument is the data that i send to the template
      });
    }else{
      res.redirect('/login')
    }

  }
  catch (err) {
    console.log(err)
    res.status(500).json(err) //sets the status then sends the error in json
  }
})


router.get('/dashboard', async (req, res) => {
  res.render('dashboard', {
    loggedIn: req.session.loggedIn,
  })
})

//SIGN UP
router.get('/signup', (req, res) => {
  res.render('signup')
})



// router.post('/signup', (req, res) => {
//   const { username, password } = req.body
//   console.log(username)
//   console.log(password)
// })

//this function is async but totally doesn't have to be if i wanted to make the User.create part into a variable that calls that function with await then i could do that
// router.post('/signup', async (req, res) => { //TO DO: CHANGE THIS FUNCTION
//   console.log('POST was made SIGNUP') //this is a marker in the console so that I can tell when the psot requests have been sent
//   const { username, password } = req.body //destructure the req body and assign the variables to username and password
//   //these variable are set by the name property
//   if(username && password){ //validates that something was actually in the input boxes
//     User.create({ //creates a new user
//       username: username, //first is the name of the key in the model next is the value that i will be passing to it
//       password: password
//     })
//     .then((newUser) => {
//       console.log(newUser) //takes the input then console.logs it 
//     })
//     .catch((err) => {
//       console.log(err) //sends the error
//     })
//   }
// })


//LOGIN
//change this to be login not sign up 
router.get('/login', (req, res) => {
  res.render('login')
})


// router.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   console.log('login: ' + username) 
//   console.log('login: ' + password) 
// })


// router.post('/login', async (req, res) => {
//   console.log('POST was made LOGIN')
//   const { username, password } = req.body
//   if(username && password){
//     const dbUserData = await User.findAll() //pulls all the users and then puts them in json format
//     const users = dbUserData.map((user) => {
//       return user.get({ plain: true })
//     })
//     users.forEach(user => {
//       if(user === username){
//         res.render('homepage') //if there is a username that matches this happens
//         //TO DO: ADD PASSWORK VARIFICATION TOO
//         //TO DO: MAKE THE COOKIES THINGS
//         return;
//       }else{
//         //TO DO: THIS PART MESSES EVERYTHING UP BECAUSE THE POST REQUEST ARE MAKE ON LOAD 
//         console.log('username is not in database') //if there isnt this happens
//       }
//     })
//   }
// })


module.exports = router;
