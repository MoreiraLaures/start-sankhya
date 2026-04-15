import { Router, Request, Response } from 'express';
import { getPartners, createPartner, CreatePartnerInput } from '../services/partnerService';

const router = Router();

const REQUIRED_FIELDS: (keyof CreatePartnerInput)[] = [
  'NOMEPARC',
  'TIPPESSOA',
  'CLIENTE',
  'ATIVO',
  'CODCID',
];

router.get('/', async (req: Request, res: Response) => {
  try {
    const partners = await getPartners();
    res.json(partners);
  } catch (error: any) {
    console.error('[GET /partners]', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const missing = REQUIRED_FIELDS.filter(field => !req.body[field]);

  if (missing.length > 0) {
    res.status(400).json({
      error: 'Campos obrigatórios ausentes',
      fields: missing,
    });
    return;
  }

  try {
    const input: CreatePartnerInput = req.body;
    const partner = await createPartner(input);
    res.status(201).json(partner);
  } catch (error: any) {
    console.error('[POST /partners]', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;