import {useEffect, useState} from 'react';
import {fetchStatements} from '../services/api';
import type {Statement} from '../services/types';

interface State {
  statements: Statement[];
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: State = {
  statements: [],
  loading: true,
  error: null,
};

export function useStatements(): State {
  const [state, setState] = useState<State>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;
    fetchStatements()
      .then((statements) => {
        if (!cancelled) {
          setState({statements, loading: false, error: null});
        }
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setState({statements: [], loading: false, error: error.message});
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
