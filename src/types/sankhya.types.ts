export type SankhyaField = { $: string };

export type SankhyaEntity = { [key: string]: SankhyaField };

export type SankhyaResponse = {
  serviceName: string;
  status: string;
  responseBody: {
    entities: {
      total: string;
      hasMoreResult: string;
      metadata: {
        fields: {field: Array<{name: string}>};
      };
      entity: SankhyaEntity | SankhyaEntity[];
    };
  };
};
export type SankhyaSaveResponse = {
  serviceName: string;
  status: string;
  responseBody: {
    entities: {
      entity: Record<string, { $: string }>;
    };
  };
};

export type SankhyaConfirmResponse = {
  serviceName: string;
  status: string;
  statusMessage?: string;
  responseBody?: {
    notas?: {
      nota?: {
        NUNOTA?: { $: string };
        NUMNOTA?: { $: string };
      };
    };
  };
};

export type SankhyaMgeProdResponse<T = any> = {
  serviceName: string;
  status: string;
  pendingPrinting?: string;
  transactionId?: string;
  responseBody: T;
};