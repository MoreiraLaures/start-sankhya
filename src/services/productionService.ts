// src/services/productionService.ts

import axios from 'axios';
import { getAuthToken } from '../auth/getToken';
import { SankhyaMgeProdResponse } from '../types/sankhya.types';
import {
  CreateOPInput,
  CreateOPResult,
  GetOPInput,
  GetOPResult,
  GetProdutosAcabadosInput,
  GetMateriaisAlternativosInput,
  ValidarLoteInput,
  ConfirmOPInput,
  ConfirmOPResult,
  IniciarAtividadeInput } from '../types/production.types';

const MGEPROD_URL = 'https://api.sandbox.sankhya.com.br/gateway/v1/mgeprod/service.sbr';

const PROD_CLIENT_EVENTS = [
  'br.com.sankhya.mgeProd.libera.wc',
  'br.com.sankhya.mgeprod.libera.wc.suspender',
  'br.com.mgeprod.clientEvent.cancelaOP.deleteNotaConfirmada',
];

function buildClientEventList() {
  return {
    clientEventList: {
      clientEvent: PROD_CLIENT_EVENTS.map(e => ({ $: e })),
    },
  };
}

export async function createOP(input: CreateOPInput): Promise<CreateOPResult> {
  const { token } = await getAuthToken();

  const payload = {
    serviceName: 'LancamentoOrdemProducaoSP.lancarOPPeloItemDoPedido',
    requestBody: {
      params: {
        planta: { $: input.planta },
        itens: {
          item: input.itens.map(i => ({ NUNOTA: i.NUNOTA })),
        },
      },
      ...buildClientEventList(),
    },
  };

  const response = await axios.post<SankhyaMgeProdResponse<{ nulop: { $: string } }>>(
    `${MGEPROD_URL}?serviceName=LancamentoOrdemProducaoSP.lancarOPPeloItemDoPedido&outputType=json`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.status !== '1') {
    throw new Error(`[Sankhya] ${JSON.stringify(response.data)}`);
  }

  console.log(`[Production][createOP]: OP criada com nulop ${response.data.responseBody.nulop.$}`);

  return {
    nulop: Number(response.data.responseBody.nulop.$),
  };
}

export async function validarLote(input: ValidarLoteInput): Promise<void> {
  const { token } = await getAuthToken();

  const payload = {
    serviceName: 'LancamentoOrdemProducaoSP.validarTamanhoLote',
    requestBody: {
      params: {
        tamLote: input.tamLote,
        multiploIdeal: input.multiploIdeal,
        minLote: input.minLote,
      },
      ...buildClientEventList(),
    },
  };

  const response = await axios.post<SankhyaMgeProdResponse<any>>(
    `${MGEPROD_URL}?serviceName=LancamentoOrdemProducaoSP.validarTamanhoLote&outputType=json`,
    payload,
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );

  if (response.data.status !== '1') {
    throw new Error(`[Sankhya] ${JSON.stringify(response.data)}`);
  }

  console.log(`[Production][validarLote]: Lote validado`);
}

export async function getOP(input: GetOPInput): Promise<GetOPResult> {
  const { token } = await getAuthToken();

  const payload = {
    serviceName: 'LancamentoOrdemProducaoSP.getLancamentoOP',
    requestBody: {
      params: {
        nulop: String(input.nulop),
        useconfigpi: true,
      },
      ...buildClientEventList(),
    },
  };

  const response = await axios.post<SankhyaMgeProdResponse<{ lancamento: GetOPResult }>>(
    `${MGEPROD_URL}?serviceName=LancamentoOrdemProducaoSP.getLancamentoOP&outputType=json`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.status !== '1') {
    throw new Error(`[Sankhya] ${JSON.stringify(response.data)}`);
  }

  console.log(`[Production][getOP]: OP ${input.nulop} consultada`);

  return response.data.responseBody.lancamento;
}

export async function getProdutosAcabados(input: GetProdutosAcabadosInput) {
  const { token } = await getAuthToken();

  const payload = {
    serviceName: 'LancamentoOrdemProducaoSP.getListaProdutoAcabadoLancamentoOP',
    requestBody: {
      params: {
        nulop: String(input.nulop),
        codProdMP: input.codProdMP ?? 0,
        controleMP: input.controleMP ?? ' ',
      },
      ...buildClientEventList(),
    },
  };

  const response = await axios.post<SankhyaMgeProdResponse<{ produtosAcabado: any }>>(
    `${MGEPROD_URL}?serviceName=LancamentoOrdemProducaoSP.getListaProdutoAcabadoLancamentoOP&outputType=json`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.status !== '1') {
    throw new Error(`[Sankhya] ${JSON.stringify(response.data)}`);
  }

  return response.data.responseBody.produtosAcabado;
}

export async function getMateriaisAlternativos(input: GetMateriaisAlternativosInput) {
  const { token } = await getAuthToken();

  const payload = {
    serviceName: 'LancamentoOrdemProducaoSP.getListaMaterialAlternativo',
    requestBody: {
      params: {
        idproc: input.idproc,
        codplp: input.codplp,
        codProdPA: input.codProdPA,
        controlePA: input.controlePA ?? ' ',
        codProdMP: input.codProdMP,
        controleMP: input.controleMP ?? ' ',
        tamLote: input.tamLote,
        calTamLote: input.calTamLote,
        nulop: input.nulop,
        seqop: input.seqop,
      },
      ...buildClientEventList(),
    },
  };

  const response = await axios.post<SankhyaMgeProdResponse<{ materialAlternativo: any }>>(
    `${MGEPROD_URL}?serviceName=LancamentoOrdemProducaoSP.getListaMaterialAlternativo&outputType=json`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.status !== '1') {
    throw new Error(`[Sankhya] ${JSON.stringify(response.data)}`);
  }

  return response.data.responseBody.materialAlternativo;
}
export async function confirmOP(input: ConfirmOPInput): Promise<ConfirmOPResult> {
  const { token } = await getAuthToken();

  const payload = {
    serviceName: 'LancamentoOrdemProducaoSP.lancarOrdensDeProducao',
    requestBody: {
      params: {
        nulop: String(input.nulop),
        ignorarWarnings: input.ignorarWarnings ?? 'N',
      },
      ...buildClientEventList(),
    },
  };

  const response = await axios.post<SankhyaMgeProdResponse<{
    ordensIniciadas: { quantidade: { $: string } };
    ordens: { ordem: { $: string } | Array<{ $: string }> };
  }>>(
    `${MGEPROD_URL}?serviceName=LancamentoOrdemProducaoSP.lancarOrdensDeProducao&outputType=json`,
    payload,
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );

  if (response.data.status !== '1') {
    throw new Error(`[Sankhya] ${JSON.stringify(response.data)}`);
  }

  const body = response.data.responseBody;
  const rawOrdens = body.ordens.ordem;
  const ordens = Array.isArray(rawOrdens)
    ? rawOrdens.map(o => Number(o.$))
    : [Number(rawOrdens.$)];

  console.log(`[Production][confirmOP]: ${ordens.length} OP(s) confirmada(s): ${ordens.join(', ')}`);

  return {
    ordensIniciadas: Number(body.ordensIniciadas.quantidade.$),
    ordens,
  };
}
const OPER_CLIENT_EVENTS = [
  'br.com.sankhya.mgeprod.apontamentos.divergentes',
  'br.com.sankhya.mgeProd.wc.indisponivel',
  'br.com.sankhya.mgeprod.redimensionar.op.pa.perda',
  'br.com.sankhya.mgeprod.redimensionar.op.pa.avisos',
  'br.com.sankhya.mgeprod.trocaturno.avisos',
  'br.com.sankhya.mgeprod.finalizar.liberacao.desvio.pa',
  'br.com.sankhya.actionbutton.clientconfirm',
];

function buildOperClientEvents() {
  return {
    clientEventList: {
      clientEvent: OPER_CLIENT_EVENTS.map(e => ({ $: e })),
    },
  };
}

export async function iniciarAtividade(input: IniciarAtividadeInput): Promise<void> {
  const { token } = await getAuthToken();

  const payload = {
    serviceName: 'OperacaoProducaoSP.iniciarInstanciaAtividades',
    requestBody: {
      instancias: {
        instancia: [{ IDIATV: { $: input.IDIATV } }],
      },
      ...buildOperClientEvents(),
    },
  };

  const response = await axios.post<SankhyaMgeProdResponse<any>>(
    `${MGEPROD_URL}?serviceName=OperacaoProducaoSP.iniciarInstanciaAtividades&outputType=json`,
    payload,
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );

  if (response.data.status !== '1') {
    throw new Error(`[Sankhya] ${JSON.stringify(response.data)}`);
  }

  console.log(`[Production][iniciarAtividade]: Atividade ${input.IDIATV} iniciada`);
}

export async function listarAtividades(idiproc: number) {
  const { token } = await getAuthToken();

  const payload = {
    serviceName: 'DatasetSP.loadRecords',
    requestBody: {
      dataSetID: '001',
      entityName: 'InstanciaAtividade',
      standAlone: false,
      fields: [
        'IDIPROC', 'IDIATV', 'SITUACAO', 'CODPRODPA', 'CONTROLEPA',
        'DESCRPRODPA', 'QTDPRODUZIR', 'DHINICIO', 'DHFINAL',
        'IDEFX', 'CODWCP', 'PRIORIDADE', 'NROLOTE',
        'Atividade.IDPROC',
        'CabecalhoInstanciaProcesso.ProcessoProdutivo.DESCRABREV'
      ],
      tryJoinedFields: true,
      parallelLoader: true,
      criteria: {
        expression: '(this.IDIPROC = ' + idiproc + ')',
        parameters: [],
        },

      ...buildOperClientEvents(),
    },
  };

  const response = await axios.post(
    'https://api.sandbox.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=DatasetSP.loadRecords&outputType=json',
    payload,
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );

  if (response.data.status !== '1') {
    throw new Error(`[Sankhya] ${JSON.stringify(response.data)}`);
  }

  console.log(`[Production][listarAtividades]: Atividades do IDIPROC ${idiproc} consultadas`);

  const fields = [
  'IDIPROC', 'IDIATV', 'SITUACAO', 'CODPRODPA', 'CONTROLEPA',
  'DESCRPRODPA', 'QTDPRODUZIR', 'DHINICIO', 'DHFINAL',
  'IDEFX', 'CODWCP', 'PRIORIDADE', 'NROLOTE',
  'IDPROC', 'DESCRABREV'
];

const rows = response.data.responseBody.result ?? [];
const total = response.data.responseBody.total ?? '0';

const atividades = rows.map((row: string[]) => {
  const obj: Record<string, string> = {};
  fields.forEach((field, i) => {
    obj[field] = row[i] ?? '';
  });
  return obj;
});

return { total: Number(total), atividades };

}
export async function listarMPs(input: {
  idefx: number;
  seqoper: number;
  idproc: number;
  tipomaterial: string;
  codprodpa: number;
  controlePA: string;
  idiproc: number;
}) {
  const { token } = await getAuthToken();

  const payload = {
    serviceName: 'OrdemProducaoSP.getListaMPsMovimentacaoManual',
    requestBody: {
      params: {
        idefx: String(input.idefx),
        seqoper: String(input.seqoper),
        idproc: String(input.idproc),
        tipomaterial: input.tipomaterial,
        codprodpa: String(input.codprodpa),
        controlePA: input.controlePA,
        idiproc: String(input.idiproc),
      },
      ...buildOperClientEvents(),
    },
  };

  const response = await axios.post<SankhyaMgeProdResponse<{ materiais: any }>>(
    `${MGEPROD_URL}?serviceName=OrdemProducaoSP.getListaMPsMovimentacaoManual&outputType=json`,
    payload,
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );

  if (response.data.status !== '1') {
    throw new Error(`[Sankhya] ${JSON.stringify(response.data)}`);
  }

  console.log(`[Production][listarMPs]: MPs listadas para IDIPROC ${input.idiproc}`);
  return response.data.responseBody.materiais;
}

export async function movimentarMP(input: {
  idiproc: number;
  idiatv: number;
  operacao: { IDEFX: number; SEQOPER: number };
  materiais: { CODPRODMP: number; CONTROLEMP: string; QTDMOV: number; UNIDADE: string }[];
}) {
  const { token } = await getAuthToken();

  const payload = {
    serviceName: 'OrdemProducaoSP.confirmaMovimentacaoEstoqueManual',
    requestBody: {
      params: {
        idiproc: String(input.idiproc),
        idiatv: String(input.idiatv),
        idproc: '',
        operacao: input.operacao,
        materiais: [{
          material: input.materiais.map(m => ({
            CODPRODMP: m.CODPRODMP,
            CONTROLEMP: m.CONTROLEMP ?? '',
            QTDMOV: m.QTDMOV,
            UNIDADE: m.UNIDADE,
          })),
        }],
      },
      ...buildOperClientEvents(),
    },
  };

  const response = await axios.post<SankhyaMgeProdResponse<{ pk: { NUNOTA: { $: string } } }>>(
    `${MGEPROD_URL}?serviceName=OrdemProducaoSP.confirmaMovimentacaoEstoqueManual&outputType=json`,
    payload,
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );

  if (response.data.status !== '1') {
    throw new Error(`[Sankhya] ${JSON.stringify(response.data)}`);
  }

  const nunota = Number(response.data.responseBody.pk.NUNOTA.$);
  console.log(`[Production][movimentarMP]: Itens adicionados, NUNOTA=${nunota}`);
  return { nunota };
}
