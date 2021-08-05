//jshint esversion:6

// подключение
const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const ejs = require("ejs");

// подключение Lodash
var _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



app.set('view engine', 'ejs');

// ▼▼▼▼ body-parser ▼▼▼▼, теперь его не нужно импортировать отдельно, достаточно написать такой код:
app.use(express.urlencoded({
  extended: true
}));


// mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);

// создаем глобальный array posts
// let posts = [];

// get
app.get('/', (req, res) => {

  Post.find((err, foundPosts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        homeStartingPage: homeStartingContent,
        arrayPosts: foundPosts
      });
    }
  });



});

// get parameters
app.get('/posts/:postId', (req, res) => {


  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, (err, post) => {
    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });
});


// get about
app.get('/about', (req, res) => {
  res.render("about", {
    aboutPage: aboutContent
  });
});

// get contact
app.get('/contact', (req, res) => {
  res.render("contact", {
    contactPage: contactContent
  });
});

// get compose
app.get('/compose', (req, res) => {
  res.render("compose", {
    contactPage: contactContent
  });
});



// post compose
app.post("/compose", (req, res) => {

  // добавляем объект post в глобальный array posts
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save((err) => {
    if (!err) {
      res.redirect('/');
    }
  });

});




app.use(express.static("public"));