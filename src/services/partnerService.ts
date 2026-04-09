import axios from 'axios';
import { getAuthToken } from '../auth/getToken';
import { SankhyaEntity, SankhyaResponse } from '../types/sankhya.types';
  
export class Partner {
  codparc: number;
  nomeparc: string;
  cliente: string;
  codcid: string;
  CGC_CPF: string;

  constructor(data: {
    codparc: number;
    nomeparc: string;
    cliente: string;
    codcid: string;
    CGC_CPF: string;
  }) {
    this.codparc  = data.codparc;
    this.nomeparc = data.nomeparc;
    this.cliente  = data.cliente;
    this.codcid   = data.codcid;
    this.CGC_CPF  = data.CGC_CPF;
  }
}

function mapEntity(
  fields: Array<{ name: string }>,
  entity: SankhyaEntity
): Record<string, string> {
  return fields.reduce((acc, field, index) => {
    acc[field.name] = entity[`f${index}`]?.$ ?? '';
    return acc;
  }, {} as Record<string, string>);
}

export async function getPartners(): Promise<Partner[]> {
  const { token } = await getAuthToken();

  const payload = {
    serviceName: 'CRUDServiceProvider.loadRecords',
    requestBody: {
      dataSet: {
        rootEntity: 'Parceiro',
        includePresentationFields: 'S',
        offsetPage: '0',
        criteria: {
          expression: { $: 'this.CLIENTE = ?' },
          parameter: [{ $: 'S', type: 'S' }],
        },
        entity: {
          fieldset: {
            list: 'CODPARC,NOMEPARC,CLIENTE,CODCID,CGC_CPF',
          },
        },
      },
    },
  };

  const response = await axios.post<SankhyaResponse>(
    'https://api.sandbox.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=CRUDServiceProvider.loadRecords&outputType=json',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const { entities } = response.data.responseBody;
  const fields = entities.metadata.fields.field;

  const rawList = Array.isArray(entities.entity)
    ? entities.entity
    : [entities.entity];

  return rawList.map((entity) => {
    const obj = mapEntity(fields, entity);
    return new Partner({
      codparc:  Number(obj['CODPARC']),
      nomeparc: obj['NOMEPARC'],
      cliente:  obj['CLIENTE'],
      codcid:   obj['CODCID'],
      CGC_CPF:  obj['CGC_CPF'],
    });
  });
}

export type CreatePartnerInput = {
  TIPPESSOA: 'F' | 'J';   
  NOMEPARC: string;
  CODCID: string;
  ATIVO: 'S' | 'N';
  CLIENTE: 'S' | 'N';
  CLASSIFICMS: 'C' | 'P'; 
  CGC_CPF?: string;  
};

export async function createPartner(input: CreatePartnerInput): Promise<Partner> {
  const { token } = await getAuthToken();

  const localFields: Record<string, { $: string }> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      localFields[key] = { $: String(value) };
    }
  }

  const payload = {
    serviceName: 'CRUDServiceProvider.saveRecord',
    requestBody: {
      dataSet: {
        rootEntity: 'Parceiro',
        includePresentationFields: 'S',
        dataRow: {
          localFields,
        },
        entity: {
          fieldset: {
            list: 'CODPARC,NOMEPARC,CLIENTE,CODCID,CGC_CPF',
          },
        },
      },
    },
  };

  const response = await axios.post<SankhyaResponse>(
    'https://api.sandbox.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=CRUDServiceProvider.saveRecord&outputType=json',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const { entities } = response.data.responseBody;
  const fields = entities.metadata.fields.field;

  const entity = Array.isArray(entities.entity)
    ? entities.entity[0]
    : entities.entity;

  const obj = mapEntity(fields, entity as SankhyaEntity);

  return new Partner({
    codparc:  Number(obj['CODPARC']),
    nomeparc: obj['NOMEPARC'],
    cliente:  obj['CLIENTE'],
    codcid:   obj['CODCID'],
    CGC_CPF:  obj['CGC_CPF'],
  });
}