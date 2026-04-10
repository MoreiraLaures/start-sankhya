// src/services/orderService

import axios from 'axios';
import { getAuthToken } from '../auth/getToken';
import { SankhyaSaveResponse } from '../types/sankhya.types';
import { CreateOrderHeaderInput, OrderHeader,CreateOrderItemInput,OrderItem} from '../types/order.types';

function mapSaveEntity(entity: Record<string, { $: string }>): Record<string, string> {
  return Object.entries(entity).reduce((acc, [key, value]) => {
    acc[key] = value?.$ ?? '';
    return acc;
  }, {} as Record<string, string>);
}

export async function createOrderHeader(input: CreateOrderHeaderInput): Promise<OrderHeader> {
  const { token } = await getAuthToken();
  
  const localFields: Record<string, { $: string }> = {
  NUMNOTA: { $: '0' },
};
for (const [key, value] of Object.entries(input)) {
  if (value !== undefined) {
    localFields[key] = { $: String(value) };
  }
}

  const returnFields = ['NUNOTA', 'CODPARC', 'CODTIPOPER', 'DTNEG', 'CODTIPVENDA', 'CODNAT', 'CODCENCUS'];

  const payload = {
    serviceName: 'CRUDServiceProvider.saveRecord',
    requestBody: {
      dataSet: {
        rootEntity: 'CabecalhoNota',
        includePresentationFields: 'S',
        dataRow: {
          localFields,
        },
        entity: {
          fieldset: {
            list: returnFields.join(','),
          },
        },
      },
    },
  };

  const response = await axios.post<SankhyaSaveResponse>(
    'https://api.sandbox.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=CRUDServiceProvider.saveRecord&outputType=json',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (response.data.status === '0') {
  throw new Error(`[Sankhya] ${response.data}`);
}
  console.log('[Order][createOrderHeader] Response:', JSON.stringify(response.data, null, 2));

  console.log(`[Order][createOrderHeader]: Cabeçalho criado 🦍🙈`);

  const obj = mapSaveEntity(response.data.responseBody.entities.entity);

  return {
    nunota: Number(obj['NUNOTA']),
    ...obj,
  };
}

export async function createOrderItem(input: CreateOrderItemInput): Promise<OrderItem> {
  const { token } = await getAuthToken();

  const localFields: Record<string, { $: string }> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      localFields[key] = { $: String(value) };
    }
  }

  const returnFields = ['NUNOTA', 'CODPROD', 'QTDNEG', 'VLRUNIT', 'VLRTOT'];

  const payload = {
    serviceName: 'CRUDServiceProvider.saveRecord',
    requestBody: {
      dataSet: {
        rootEntity: 'ItemNota',
        includePresentationFields: 'S',
        dataRow: {
          localFields,
        },
        entity: {
          fieldset: {
            list: returnFields.join(','),
          },
        },
      },
    },
  };

  const response = await axios.post<SankhyaSaveResponse>(
    'https://api.sandbox.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=CRUDServiceProvider.saveRecord&outputType=json',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.status === '0') {
    throw new Error(`[Sankhya] ${JSON.stringify(response.data, null, 2)}`);
  }

  console.log(`[Order][createOrderItem]: Item criado na nota ${input.NUNOTA}`);

  const obj = mapSaveEntity(response.data.responseBody.entities.entity);

  return {
    nunota: Number(obj['NUNOTA']),
    codprod: Number(obj['CODPROD']),
    ...obj,
  };
}