// src/routes/order

import { Router, Request, Response } from 'express';
import { createOrderHeader, createOrderItem,linkOrderToOP ,confirmOrder  } from '../services/orderService';
import { CreateOrderHeaderInput, CreateOrderItemInput,LinkOrderToOPInput, ConfirmOrderInput  } from '../types/order.types';

const router = Router();

const REQUIRED_HEADER_FIELDS: (keyof CreateOrderHeaderInput)[] = [
  'CODPARC',
  'CODTIPOPER',
  'DTNEG',
  'CODEMP',
  'CODTIPVENDA',
  'CODNAT',
  'CODCENCUS',
];

router.post('/header', async (req: Request, res: Response) => {
  const missing = REQUIRED_HEADER_FIELDS.filter(field => req.body[field] == null);

  if (missing.length > 0) {
    res.status(400).json({
      error: 'Campos obrigatórios ausentes',
      fields: missing,
    });
    return;
  }

  try {
    const input: CreateOrderHeaderInput = req.body;
    const header = await createOrderHeader(input);
    res.status(201).json(header);
  } catch (error: any) {
    console.error('[POST /orders/header]', error.message);
    res.status(500).json({ error: error.message });
  }
});

const REQUIRED_ITEM_FIELDS: (keyof CreateOrderItemInput)[] = [
  'NUNOTA',
  'CODPROD',
  'QTDNEG',
  'VLRUNIT',
];

router.post('/item', async (req: Request, res: Response) => {
  const missing = REQUIRED_ITEM_FIELDS.filter(field => req.body[field] == null);

  if (missing.length > 0) {
    res.status(400).json({
      error: 'Campos obrigatórios ausentes',
      fields: missing,
    });
    return;
  }

  try {
    const input: CreateOrderItemInput = req.body;
    const item = await createOrderItem(input);
    res.status(201).json(item);
  } catch (error: any) {
    console.error('[POST /orders/item]', error.message);
    res.status(500).json({ error: error.message });
  }
});


const REQUIRED_LINK_OP_FIELDS: (keyof LinkOrderToOPInput)[] = [
  'IDIPROC',
  'NUNOTA',
  'SEQNOTA',
];

router.post('/link-op', async (req: Request, res: Response) => {
  const missing = REQUIRED_LINK_OP_FIELDS.filter(field => req.body[field] == null);

  if (missing.length > 0) {
    res.status(400).json({
      error: 'Campos obrigatórios ausentes',
      fields: missing,
    });
    return;
  }

  try {
    const input: LinkOrderToOPInput = req.body;
    const result = await linkOrderToOP(input);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('[POST /orders/link-op]', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/confirm', async (req: Request, res: Response) => {
  if (req.body.NUNOTA == null) {
    res.status(400).json({
      error: 'Campos obrigatórios ausentes',
      fields: ['NUNOTA'],
    });
    return;
  }

  try {
    const input: ConfirmOrderInput = req.body;
    const result = await confirmOrder(input);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('[POST /orders/confirm]', error.message);
    res.status(500).json({ error: error.message });
  }
});


export default router;