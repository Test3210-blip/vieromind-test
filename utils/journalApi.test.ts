import * as journalApi from './journalApi';
import * as api from './api';

jest.mock('./api');

const mockApiRequest = api.apiRequest as jest.Mock;

describe('journalApi', () => {
  afterEach(() => jest.clearAllMocks());

  it('fetchJournals calls apiRequest with correct params', async () => {
    mockApiRequest.mockResolvedValueOnce([{ id: '1', title: 'Test', content: 'Hello', email: 'a@b.com' }]);
    const result = await journalApi.fetchJournals('a@b.com');
    expect(mockApiRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: process.env.NEXT_PUBLIC_BACKEND_URL + '/journals',
      params: { email: 'a@b.com' },
    });
    expect(result).toEqual([{ id: '1', title: 'Test', content: 'Hello', email: 'a@b.com' }]);
  });

  it('createJournal calls apiRequest with correct params', async () => {
    mockApiRequest.mockResolvedValueOnce(undefined);
    await journalApi.createJournal({ title: 'T', content: 'C', email: 'a@b.com' });
    expect(mockApiRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: process.env.NEXT_PUBLIC_BACKEND_URL + '/journals',
      data: { title: 'T', content: 'C', email: 'a@b.com' },
    });
  });

  it('deleteJournal calls apiRequest with correct params', async () => {
    mockApiRequest.mockResolvedValueOnce(undefined);
    await journalApi.deleteJournal('123', 'a@b.com');
    expect(mockApiRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: process.env.NEXT_PUBLIC_BACKEND_URL + '/journals/123',
      params: { email: 'a@b.com' },
    });
  });
});
