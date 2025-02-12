import express from 'express';
import { getBankList } from '../controller/BanksController.js';

const router = express.Router();

router.get('/', getBankList);


export default router;
