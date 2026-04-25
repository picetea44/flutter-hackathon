import {useCallback, useEffect, useState} from 'react';
import {createLatestPrediction, fetchLatestPrediction} from '../services/api';
import type {PredictionHistory} from '../services/types';

interface State {
  prediction: PredictionHistory | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
}

const INITIAL_STATE: State = {
  prediction: null,
  loading: true,
  generating: false,
  error: null,
};

export function useLatestPrediction() {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const load = useCallback(() => {
    setState({prediction: null, loading: true, generating: false, error: null});
    fetchLatestPrediction()
      .then((prediction) => {
        setState({prediction, loading: false, generating: false, error: null});
      })
      .catch((error: Error) => {
        setState({
          prediction: null,
          loading: false,
          generating: false,
          error: error.message,
        });
      });
  }, []);

  const generate = useCallback(async () => {
    setState((prev) => ({...prev, generating: true, error: null}));
    try {
      const prediction = await createLatestPrediction();
      setState({prediction, loading: false, generating: false, error: null});
    } catch (error) {
      setState((prev) => ({
        ...prev,
        generating: false,
        error: (error as Error).message,
      }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {...state, refetch: load, generate};
}
