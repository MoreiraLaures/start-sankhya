import { Router, Request, Response } from 'express';
import { getPartners, createPartner, CreatePartnerInput } from '../services/partnerService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const partners = await getPartners();
    res.json(partners);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const input: CreatePartnerInput = req.body;
    const partner = await createPartner(input);
    res.status(201).json(partner);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;