import express from 'express';
import verifyToken from '../utils/verifyUser.js';
import postController from '../controllers/post-controller.js';

const router=express.Router();

router.route('/create').post(verifyToken,postController.create);
router.route('/getposts').get(postController.getposts);
router.route('/deletepost/:postId/:userId').delete(verifyToken,postController.deletepost);
router.route('/updatepost/:postId/:userId').put(verifyToken,postController.updatepost);

export default router;