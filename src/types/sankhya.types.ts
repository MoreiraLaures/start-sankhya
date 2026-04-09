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
