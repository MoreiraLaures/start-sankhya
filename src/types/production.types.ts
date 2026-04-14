export type CreateOPInput = {
  planta: number;
  itens: { NUNOTA: number }[];
} & Record<string, any>;

export type CreateOPResult = {
  nulop: number;
} & Record<string, string | number>;

export type GetOPInput = {
  nulop: number;
};

export type GetOPResult = {
  nulop: string;
} & Record<string, any>;


export type GetProdutosAcabadosInput = {
  nulop: number;
  codProdMP?: number;
  controleMP?: string;
};

export type GetMateriaisAlternativosInput = {
  idproc: number;
  codplp: number;
  codProdPA: number;
  controlePA?: string;
  codProdMP: number;
  controleMP?: string;
  tamLote: number;
  calTamLote: number;
  nulop: number;
  seqop: number;
};

export type ValidarLoteInput = {
  tamLote: number;
  multiploIdeal: number;
  minLote: number;
} & Record<string, any>;

export type ConfirmOPInput = {
  nulop: number;
  ignorarWarnings?: string;
} & Record<string, any>;

export type ConfirmOPResult = {
  ordensIniciadas: number;
  ordens: number[];
} & Record<string, any>;
