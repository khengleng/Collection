import axios, { AxiosInstance } from 'axios';

export class FineractClient {
  private client: AxiosInstance;

  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Fineract-Platform-TenantId': 'default',
        'Authorization': `Basic ${apiKey}`,
      },
    });
  }

  async getAccount(accountId: string) {
    const response = await this.client.get(`/accounts/${accountId}`);
    return response.data;
  }
}
