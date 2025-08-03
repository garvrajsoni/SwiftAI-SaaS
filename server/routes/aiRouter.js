import express from 'express';
import  {generateArticle, generateBlogTittle, generateImage, removeImgeBackground, removeImgeObject, resumeReview}  from '../controllers/aiController.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const aiRouter = express.Router();

aiRouter.post('/generate-article',auth, generateArticle);
aiRouter.post('/generate-blog-tittle',auth, generateBlogTittle);
aiRouter.post('/generate-image',auth, generateImage);
aiRouter.post('/remove-image-background',auth, upload.single('image'), removeImgeBackground);
aiRouter.post('/remove-image-object',auth, upload.single('image'), removeImgeObject);
aiRouter.post('/resume-review',auth, upload.single('resume'), resumeReview);


export default aiRouter;