import express from 'express';
import commentController from '../controllers/comment-controller.js';
import verifyToken from "../utils/verifyUser.js";

const router=express.Router();

router.route('/create').post(verifyToken,commentController.createComment);
router.route('/getPostComments/:postId').get(commentController.getPostComments);
router.route('/likeComment/:commentId').put(verifyToken,commentController.likeComment);
router.route('/editComment/:commentId').put(verifyToken,commentController.editComment);
router.route('/deleteComment/:commentId').delete(verifyToken,commentController.deleteComment);
router.route('/getcomments').get(verifyToken,commentController.getComments);

export default router;