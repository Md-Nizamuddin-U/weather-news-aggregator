import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type State = {
  units: 'metric' | 'imperial';
  newsCategories: string[]; // not used deeply but allow user selection
};

type Action =
  | { type: 'SET_UNITS'; payload: 'metric' | 'imperial' }
  | { type: 'SET_CATEGORIES'; payload: string[] };

const initialState: State = {
  units: 'metric',
  newsCategories: ['general'],
};

const AppContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_UNITS':
      return { ...state, units: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, newsCategories: action.payload };
    default:
      return state;
  }
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
