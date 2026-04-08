import { getPartners } from './services/partnerService';

(async () => {
  try {
    console.log('Buscando clientes...\n');
    const clientes = await getPartners();
    console.log(`Total: ${clientes.length} clientes\n`);
    console.table(clientes);
  } catch (error: any) {
    console.error('[Erro]', error?.response?.data ?? error.message);
  }
})();