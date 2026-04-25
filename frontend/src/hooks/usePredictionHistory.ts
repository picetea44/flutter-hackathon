import { useCallback, useEffect, useState } from 'react';
import { fetchPredictionHistory } from '../services/api';
import type { PredictionHistory } from '../services/types';

interface State {
  history: PredictionHistory[];
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: State = {
  history: [],
  loading: true,
  error: null,
};

export function usePredictionHistory() {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const load = useCallback(() => {
    setState({ history: [], loading: true, error: null });
    fetchPredictionHistory()
      .then((history) => {
        setState({ history, loading: false, error: null });
      })
      .catch((error: Error) => {
        setState({
          history: [],
          loading: false,
          error: error.message,
        });
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refetch: load };
}
