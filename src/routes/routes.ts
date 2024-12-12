import express, { Router } from 'express';
import { PhantomController } from '../controllers/PhantomController';

const router: Router = express.Router();

router.get('/callback', PhantomController.handleCallback);
router.get('/success', PhantomController.handleSuccess);

export default router;