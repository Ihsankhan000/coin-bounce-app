const express = require('express');
const authController = require('../controller/authController');
const blogController = require('../controller/blogController');
const commentController = require('../controller/commentController');
const auth = require('../middlewares/auth');

const router = express.Router();


//1 user
// register.
router.post('/register', authController.register);

// login.
router.post('/login', authController.login);

// logout.
router.post('/logout' ,auth, authController.logout);

// refresh.
// router.get('/refresh', authController.refresh);










//2 blog
// CRUD
// create.
router.post('/blog', auth, blogController.create);

// read all blogs.
router.get('/blog/all', auth, blogController.getAll);

// read blog by id.
router.get('/blog/:id', auth, blogController.getById);

// update.
router.put('/blog', auth, blogController.update);

// delete.
router.delete('/blog/:id', auth, blogController.delete)










//3 comment
//create comment.
router.post('/comment', auth, commentController.create);


// read or Get comment by blod id.
router.get('/comment/:id', auth, commentController.getById);



module.exports = router;