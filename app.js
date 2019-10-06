//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose')
const port = 8080;
const postedArticles = [];

const homeStartingContent = "Welcome to the Simple Blogpost Journal. This journal was first initiated on the 5th October 2019, during the Navaratri Festival time. Today was the Saraswati pooja day, and hence an auspicious day. The project was completed on the 6th October 2019, on the Durgasthami Day. Another auspicious day. The idea is to publish some interesting thing on the internet on your own platform, as a proof of your success. This app is created using the MEAN stack, uses EJS templates and you are welcome to be a part of the story.";
const aboutContent = "Since 2010, Altius Inc has been in the forefront of technology, providing technology services to its clients and partners enabling them on the leading-edge technology. Altius’ technology evangelization programs has enabled thousands of developers to acquire and use knowledge on technologies such as MEAN Stack (Mongo, ExpressJS, Angular and NodeJS), Core Java, Advanced Java, Web Java, Secure Java, Enterprise Java, Android, Enterprise Architecture, Product Architecture, Data Architecture, Integration Architecture, Architecture Evaluation, Design and Architectural Patterns and Styles and many more such technologies. This app attempts to showcase the technology capabilities on Altius Inc.";
const contactContent = "We are head-quartered at Bangalore, and our address is at: No. 3, 2nd Main, Shankarnagar, Mahalakshmipuram, Bengaluru 560096. Our Chennai Office is headed by Mr. Vedagiri Sankarraman, and the office is situated at Old No: 18/3, New No: 10/3, Devanathan Colony, West Mambalam, Chennai 600033. For any queries, you can also contact us at the following email address: info@altius-inc.com.";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Mongodb & Mongoose settings
// const url = "mongodb://localhost:27017/blogDB"
const url = "mongodb+srv://blogAdmin:abc@123@cluster0-o2owr.mongodb.net/blogDB"
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true})

// Schema Definition
const blogsSchema = {
  title: {
    type: String,
    required: true
  },
  article: {
    type: String,
    required: true
  }
}
// Model definition
const Blog = new mongoose.model("Blog", blogsSchema)

app.get("/", function(req, res) {
  Blog.find({}, function(err, result) {
    if (!err) {
      // console.log(result);
      res.render('home', {
        content: homeStartingContent,
        postedArticles: result
      });
    } else {
      console.log('Error processing DB search');
    }
  })
  // res.render('home', {
  //   content: homeStartingContent,
  //   postedArticles: postedArticles
  // });
  // console.log(postedArticles)
});

app.get("/about", function(req, res) {
  res.render('about', {content: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render('contact', {content: contactContent});
});

app.get("/compose", function(req, res) {
  res.render('compose');
})

app.post("/compose", function(req, res) {
  console.log(req.body)
  // var postedArticle = {
  //   title: req.body.contentTitle,
  //   article: req.body.contentContent
  // }

  // postedArticles.push(postedArticle);
  // console.log('--> ',req.body.contentTitle)
  // console.log('--> ',req.body.contentContent)
  const blog1 = new Blog({
    title: req.body.contentTitle,
    article: req.body.contentContent
  })
  
  Blog.create(blog1, function(err, result) {
    if (err) {
      console.log('Error! Blogpost could bot be stored in the DB')
    } else {
      // console.log(result)
      res.redirect("/")
    }
  })
  // console.log(postedArticles);
  // res.redirect("/");
})

app.get("/posts/:postedItem", function(req, res) {
  console.log(req.params.postedItem)
  var requestedParam = req.params.postedItem;
  // Search DB for posted Item
  Blog.find({}, function(err, result) {
    if (!err) {
      // console.log(result);
      result.forEach(function(post) {
        if (_.lowerCase(post.title) === _.lowerCase(requestedParam) ) {
          console.log('Match Found...')
          res.render('post', {article: post});
        } else {
          console.log('Match Not Found...')
        }
      })
    } else {
      console.log('Error in fetching articles from DB')
    }
  })

  // postedArticles.forEach(function(post) {
  //   if (_.lowerCase(post.title) === _.lowerCase(requestedParam) ) {
  //     console.log('Match Found...')
  //     res.render('post', {article: post});
  //   } else {
  //     console.log('Match Not Found...')
  //   }
  // })
  // res.redirect("/partials/post", {contentTitle: requestedParam});
})


if (port == null || port == "") {
  port = 8080
}

app.listen(process.env.PORT || port, function() {
  console.log(`Server started on port: ${port}`);
});