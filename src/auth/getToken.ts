//typescript
import axios from 'axios';
import qs from 'qs' ;
import dotenv from 'dotenv';

dotenv.config();

type AuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type TokenResult = {
  type: string;
  token: string;
};

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getAuthToken(): Promise<TokenResult> { // sempre que fizer uma função, temos que informar o tipo de promise dela, nesse caso é o tokenResult ou vazio

const now = Date.now();
if (cachedToken && now < tokenExpiresAt - 10_000){// este 10_000 esta em timestamp
    console.log(`[Auth][${new Date(now)}]:Estamos reutilizando o token}`)
    return { type: 'Bearer', token: cachedToken };};
console.log(`[Auth][${new Date(now)}]:Estamos requisitando um novo token`)





  const data = qs.stringify({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'client_credentials'
  });

  const config = {
    method: 'post' as const,
    maxBodyLength: Infinity,
    url: 'https://api.sandbox.sankhya.com.br/authenticate',
    headers: {
      'X-Token': process.env.X_TOKEN,
      'accept': 'application/x-www-form-urlencoded',
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

 
    const response = await axios.request<AuthResponse>(config);
    cachedToken = response.data.access_token;
    tokenExpiresAt= now + response.data.expires_in * 1000;
    


    return { type: response.data.token_type, token: cachedToken };

  } 
