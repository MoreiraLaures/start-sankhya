// src/types/order.types
export type CreateOrderHeaderInput = {
    CODPARC: number;
    CODTIPOPER: number;
    DTNEG: string;         
    ODEMP: number;       
    CODTIPVENDA: number;    
    CODNAT: number;        
    CODCENCUS: number;      
    ODVEND?: number;
    OBSERVACAO?: string;
    AD_NROINTEGRACAO?: string;   // Número da proposta
    OBSERVACAOINT?: string;
} & Record<string, string | number | undefined>;

export type OrderHeader = {
  nunota: number;
} & Record<string, string | number>;


export type CreateOrderItemInput = {
  NUNOTA: number;
  CODPROD: number;
  QTDNEG: number;
  VLRUNIT: number;

  CODLOCALORIG?: number;
  CODVOL?: string;
  VLRDESC?: number;
  PERCDESC?: number;
  AD_NROINTEGRACAO?: string;

} & Record<string, string | number | undefined>;

export type OrderItem = {
  nunota: number;
  codprod: number;
} & Record<string, string | number>;