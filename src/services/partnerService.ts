import axios from 'axios';
import { getAuthToken } from '../auth/getToken';
import { SankhyaEntity, SankhyaResponse, SankhyaSaveResponse } from '../types/sankhya.types';

// Partner  é um tipo flexível: codparc sempre presente porem qualquer campo retornado, os campos serão ser informados na API

export type Partner = {
  codparc: number;
} & Record<string, string | number>;

//loadRecords: campos indexados ( Entra como f0, f1 .....)
function mapEntity(
  fields: Array<{ name: string }>,
  entity: SankhyaEntity
): Record<string, string> {
  return fields.reduce((acc, field, index) => {
    acc[field.name] = entity[`f${index}`]?.$ ?? '';
    return acc;
  }, {} as Record<string, string>);
}

// saveRecord: campos com nomes reais como chave (CODPARC, NOMEPARC.........)
function mapSaveEntity(entity: Record<string,{$: string }>): Record<string, string> {
  return Object.entries(entity).reduce((acc, [key, value]) => {
    acc[key] = value?.$ ?? '';
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
            list: 'CODPARC,NOMEPARC,CLIENTE,CODCID,CGC_CPF,TIPPESSOA,CLIENTE,ATIVO,CLASSIFICMS,CODCID',
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
    return {
      codparc:  Number(obj['CODPARC']),
      nomeparc: obj['NOMEPARC'],
      cliente: obj['CLIENTE'],
      codcid: obj['CODCID'],
      CGC_CPF: obj['CGC_CPF'],
      TIPPESSOA: obj['TIPPESSOA'],
      CLIENTE: obj['CLIENTE'],
      ATIVO: obj['ATIVO'],
      CLASSIFICMS: obj['CLASSIFICMS'],
      CODCID: obj['CODCID'],
    };
  });
}

// Campos obrigatórios — sem default útil no Sankhya
export type CreatePartnerInput = {
  NOMEPARC: string;
  TIPPESSOA: 'F' | 'J';
  CLIENTE: 'S' | 'N';
  ATIVO: 'S' | 'N';
  CODCID: string;

  // Opcionais
  CLASSIFICMS?: 'A' | 'C' | 'R' | 'P' | 'I' | 'X' | 'T';
  RAZAOSOCIAL?: string;
  CGC_CPF?: string;
  EMAIL?: string;
  TELEFONE?: string;
  CEP?: string;
  NUMEND?: string;
  COMPLEMENTO?: string;
  DTNASC?: string;
  SEXO?: 'M' | 'F';
  IDENTINSCESTAD?: string;
  CODVEND?: number;
  CODTIPPARC?: number;
  OBSERVACOES?: string;
};

export async function createPartner(input: CreatePartnerInput): Promise<Partner> {
  const { token } = await getAuthToken();

  const localFields: Record<string, { $: string }> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      localFields[key] = { $: String(value) };
    }
  }

  // Retorna sempre CODPARC + todos os campos que foram enviados
  const returnFields = ['CODPARC', ...Object.keys(localFields).filter(k => k !== 'CODPARC')].join(',');

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
            list: returnFields,
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

  console.log(`[Partner][createPartner]: Parceiro criado com sucesso`);

  const obj = mapSaveEntity(response.data.responseBody.entities.entity);

  return {
    codparc: Number(obj['CODPARC']),
    ...obj,
  };
}