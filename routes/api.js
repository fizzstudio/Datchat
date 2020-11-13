const express = require('express');

const router = express.Router();

const BlogPost = require('../models/blogPost');

// Routes
router.get('/', (req, res) => {
    // const data = {
    //     username: 'capric',
    //     age: 20
    // }

    BlogPost.find({})
        .then((data) => {
            console.log('data', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error', error);
        });

    // res.json(data);
});

router.post('/save', (req, res) => {
    console.log('Body', req.body);
    const data = req.body;

    const newBlogPost = new BlogPost(data);

    // .save
    newBlogPost.save((error) => {
        if (error) {
            res.status(500).json({msg: "Sorry, internal server error"});
        } else {
            res.json({
                msg: 'We have received your data!!!!'
            });
        }
    });

    
});

router.get('/name', (req, res) => {
    const data = {
        username: 'yu',
        age: 24
    }
    res.json(data);
});

module.exports = router;