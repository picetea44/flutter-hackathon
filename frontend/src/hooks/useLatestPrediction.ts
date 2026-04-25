import {useEffect, useState} from 'react';
import {fetchLatestPrediction} from '../services/api';
import type {PredictionHistory} from '../services/types';

interface State {
  prediction: PredictionHistory | null;
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: State = {
  prediction: null,
  loading: true,
  error: null,
};

export function useLatestPrediction(): State {
  const [state, setState] = useState<State>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;
    fetchLatestPrediction()
      .then((prediction) => {
        if (!cancelled) {
          setState({prediction, loading: false, error: null});
        }
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setState({prediction: null, loading: false, error: error.message});
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
