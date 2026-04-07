//typescript
import axios from 'axios';
import qs from 'qs' ;
import dotenv from 'dotenv';

dotenv.config();

type AuthResponse = {
  access_token: string;
  token_type: string;
};

type TokenResult = {
  type: string;
  token: string;
};

export async function getAuthToken(): Promise<TokenResult | void> {
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

  try {
    const response = await axios.request<AuthResponse>(config);

    const token = response.data.access_token;
    const type = response.data.token_type;

    console.log(token);
    console.log(type);

    return { type, token };

  } catch (error) {
    console.log(error);
  }
}