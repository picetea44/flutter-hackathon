import type {
  ApiResponse,
  ChatResponse,
  PredictionHistory,
  Statement,
} from './types';

const BASE_URL = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {'Content-Type': 'application/json'},
    ...init,
  });
  if (!response.ok) {
    throw new Error(`API ${path} failed: ${response.status}`);
  }
  const body = (await response.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new Error(body.message);
  }
  return body.data;
}

export const fetchLatestPrediction = () =>
  request<PredictionHistory>('/predictions/latest');

export const createLatestPrediction = () =>
  request<PredictionHistory>('/predictions/latest', {method: 'POST'});

export const fetchPredictionHistory = () =>
  request<PredictionHistory[]>('/predictions/history');

export const fetchStatements = () => request<Statement[]>('/statements');

export const sendChatMessage = (message: string) =>
  request<ChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify({message}),
  });