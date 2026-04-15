// src/routes/production.ts

import { Router, Request, Response } from 'express';
import { createOP, getOP, getProdutosAcabados,validarLote, confirmOP,iniciarAtividade ,listarAtividades,listarMPs,movimentarMP } from '../services/productionService';

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

// GET /production/atividades/:idiproc — Listar atividades de uma OP
router.get('/atividades/:idiproc', async (req: Request, res: Response) => {
  const idiproc = Number(req.params.idiproc);

  if (isNaN(idiproc)) {
    res.status(400).json({ error: 'idiproc inválido' });
    return;
  }

  try {
    const result = await listarAtividades(idiproc);
    res.json(result);
  } catch (error: any) {
    console.error('[GET /production/atividades/:idiproc]', error.message);
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


router.post('/iniciar', async (req: Request, res: Response) => {
  if (req.body.IDIATV == null) {
    res.status(400).json({ error: 'Campos obrigatórios ausentes', fields: ['IDIATV'] });
    return;
  }

  try {
    await iniciarAtividade(req.body);
    res.json({ status: 'ok' });
  } catch (error: any) {
    console.error('[POST /production/iniciar]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /production/materiais — Listar matérias-primas
router.post('/materiais', async (req: Request, res: Response) => {
  const required = ['idefx', 'seqoper', 'idproc', 'tipomaterial', 'codprodpa', 'controlePA', 'idiproc'];
  const missing = required.filter(f => req.body[f] == null);
  if (missing.length > 0) {
    res.status(400).json({ error: 'Campos obrigatórios ausentes', fields: missing });
    return;
  }

  try {
    const result = await listarMPs(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('[POST /production/materiais]', error.message);
    res.status(500).json({ error: error.message });
  }
});
// POST /production/movimentar — Adicionar matérias-primas na OP
router.post('/movimentar', async (req: Request, res: Response) => {
  const { idiproc, idiatv, operacao, materiais } = req.body;
  if (idiproc == null || idiatv == null || !operacao || !Array.isArray(materiais)) {
    res.status(400).json({
      error: 'Campos obrigatórios ausentes',
      fields: ['idiproc', 'idiatv', 'operacao', 'materiais'],
    });
    return;
  }

  try {
    const result = await movimentarMP(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('[POST /production/movimentar]', error.message);
    res.status(500).json({ error: error.message });
  }
});

0
export default router;
