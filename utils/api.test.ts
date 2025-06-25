import axios from 'axios';
import { apiRequest } from './api';

jest.mock('axios');
const mockedAxios = axios as unknown as jest.Mock;

describe('apiRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns data on success', async () => {
    mockedAxios.mockResolvedValueOnce({ data: { foo: 'bar' } });
    const result = await apiRequest({ url: '/test', method: 'GET' });
    expect(result).toEqual({ foo: 'bar' });
  });

  it('throws error message from response', async () => {
    mockedAxios.mockRejectedValueOnce({ response: { data: { message: 'fail' } } });
    await expect(apiRequest({ url: '/fail', method: 'GET' })).rejects.toBe('fail');
  });

  it('throws generic error if no response', async () => {
    mockedAxios.mockRejectedValueOnce({});
    await expect(apiRequest({ url: '/fail', method: 'GET' })).rejects.toBe('Something went wrong');
  });
});
