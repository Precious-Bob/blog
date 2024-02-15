const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET HOME
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "Precious's Blog",
      description: 'Precious Blog with NodeJs, Express & MongoDB',
    };

    let perPage = 5;
    let page = req.query.page || 1;
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments({});
    const nextPage = +page + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.error(error);
  }
});

// GET POST
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: 'Simple Blog created with NodeJs, Express & MongoDb.',
    };

    res.render('post', {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Post - searchTerm
 */
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: 'Seach',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.',
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
      ],
    });

    res.render('search', {
      data,
      locals,
      currentRoute: '/',
    });
  } catch (error) {
    console.log(error);
  }
});

// Build a no results found page
module.exports = router;

// function insertPostData() {
//   Post.insertMany([
//     {
//       title: 'Authentication and Authorization in Node.js',
//       body: 'Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries.',
//     },
//     {
//       title: 'Understand how to work with MongoDB and Mongoose',
//       body: 'Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications.',
//     },
//     {
//       title: 'build real-time, event-driven applications in Node.js',
//       body: 'Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js.',
//     },
//     {
//       title: 'Discover how to use Express.js',
//       body: 'Discover how to use Express.js, a popular Node.js web framework, to build web applications.',
//     },
//     {
//       title: 'Asynchronous Programming with Node.js',
//       body: 'Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations.',
//     },
//     {
//       title: 'Learn the basics of Node.js and its architecture',
//       body: 'Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers.',
//     },
//     {
//       title: 'NodeJs Limiting Network Traffic',
//       body: 'Learn how to limit netowrk traffic.',
//     },
//     {
//       title: 'Learn Morgan - HTTP Request logger for NodeJs',
//       body: 'Learn Morgan.',
//     },
//   ]);
// }
// insertPostData();