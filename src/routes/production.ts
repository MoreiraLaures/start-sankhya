// src/routes/production.ts

import { Router, Request, Response } from 'express';
import { createOP, getOP, getProdutosAcabados,validarLote, confirmOP } from '../services/productionService';

const router = Router();





// POST /production — Criar OP a partir de pedido(s)
router.post('/', async (req: Request, res: Response) => {
  const { planta, itens } = req.body;

  if (planta == null || !Array.isArray(itens) || itens.length === 0) {
    res.status(400).json({
      error: 'Campos obrigatórios ausentes',
      fields: ['planta', 'itens (array com NUNOTA)'],
    });
    return;
  }

  try {
    const result = await createOP({ planta, itens });
    res.status(201).json(result);
  } catch (error: any) {
    console.error('[POST /production]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /production/:nulop — Consultar detalhes da OP
router.get('/:nulop', async (req: Request, res: Response) => {
  const nulop = Number(req.params.nulop);

  if (isNaN(nulop)) {
    res.status(400).json({ error: 'nulop inválido' });
    return;
  }

  try {
    const result = await getOP({ nulop });
    res.json(result);
  } catch (error: any) {
    console.error('[GET /production/:nulop]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /production/:nulop/produtos — Listar produtos acabados
router.get('/:nulop/produtos', async (req: Request, res: Response) => {
  const nulop = Number(req.params.nulop);

  if (isNaN(nulop)) {
    res.status(400).json({ error: 'nulop inválido' });
    return;
  }

  try {
    const result = await getProdutosAcabados({ nulop });
    res.json(result);
  } catch (error: any) {
    console.error('[GET /production/:nulop/produtos]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /production/validar-lote — Validar tamanho do lote
router.post('/validar-lote', async (req: Request, res: Response) => {
  const { tamLote, multiploIdeal, minLote } = req.body;

  if (tamLote == null || multiploIdeal == null || minLote == null) {
    res.status(400).json({
      error: 'Campos obrigatórios ausentes',
      fields: ['tamLote', 'multiploIdeal', 'minLote'],
    });
    return;
  }

  try {
    await validarLote({ tamLote, multiploIdeal, minLote });
    res.json({ status: 'ok' });
  } catch (error: any) {
    console.error('[POST /production/validar-lote]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /production/confirm — Confirmar/Lançar OP
router.post('/confirm', async (req: Request, res: Response) => {
  const { nulop } = req.body;

  if (nulop == null) {
    res.status(400).json({
      error: 'Campos obrigatórios ausentes',
      fields: ['nulop'],
    });
    return;
  }

  try {
    const result = await confirmOP({ nulop });
    res.status(201).json(result);
  } catch (error: any) {
    console.error('[POST /production/confirm]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /production/:nulop — Consultar detalhes da OP
router.get('/:nulop', async (req: Request, res: Response) => {
  const nulop = Number(req.params.nulop);

  if (isNaN(nulop)) {
    res.status(400).json({ error: 'nulop inválido' });
    return;
  }

  try {
    const result = await getOP({ nulop });
    res.json(result);
  } catch (error: any) {
    console.error('[GET /production/:nulop]', error.message);
    res.status(500).json({ error: error.message });
  }
});



export default router;
