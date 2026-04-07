//typescript
import { getAuthToken } from './auth/getToken';
(async () => {
  const r = await getAuthToken();
  console.log(r);
})();