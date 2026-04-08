import axios from 'axios';
import { getAuthToken } from '../auth/getToken';    

type SankhyaField = {$: string}; //$ significa qualquer valor dentro do sanhkya ( VALOR DE UM CAMPO NO CASO)
type SankhyaEntity = {[key:string]:SankhyaField}; // retorna( "f0": { "$": "648" },"f1": { "$": "EMPRESA TESTE LTDA" },) entao estamos criando uma grande lista com tudo

type SankhyaResponse = {
    serviceName:string;
    status:string;
    responseBody:{
        entities:{
            total:string;
            hasMoreResult:string;
            metadata:{
                fields:{field: Array<{name:string}>};};
                entity: SankhyaEntity | SankhyaEntity[];
        };
        
    }; 
    
};

export type Partner = {
  codparc: number;
  nomeparc: string;
  cliente: string;
  codcid: string;
  CGC_CPF:string;
};

function mapEntity(
  fields: Array<{ name: string }>,
  entity: SankhyaEntity
): Record<string, string> {
  return fields.reduce((acc, field, index) => {
    acc[field.name] = entity[`f${index}`]?.$ ?? '';
    return acc;
  }, {} as Record<string, string>);
};

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
    return {
      codparc: Number(obj['CODPARC']),
      nomeparc: obj['NOMEPARC'],
      cliente:  obj['CLIENTE'],
      codcid:   obj['CODCID'],
      CGC_CPF: obj['CGC_CPF'],
    };
  });
}