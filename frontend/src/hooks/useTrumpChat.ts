import {useCallback, useState} from 'react';
import {sendChatMessage} from '../services/api';

export interface ChatMessage {
  role: 'user' | 'trump';
  text: string;
}

interface State {
  messages: ChatMessage[];
  pending: boolean;
  error: string | null;
}

const INITIAL_STATE: State = {messages: [], pending: false, error: null};

export function useTrumpChat() {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState((prev) => ({
      messages: [...prev.messages, {role: 'user', text: trimmed}],
      pending: true,
      error: null,
    }));
    try {
      const reply = await sendChatMessage(trimmed);
      setState((prev) => ({
        messages: [...prev.messages, {role: 'trump', text: reply.response}],
        pending: false,
        error: null,
      }));
    } catch (error) {
      const message = (error as Error).message;
      setState((prev) => ({...prev, pending: false, error: message}));
    }
  }, []);

  return {...state, send};
}
