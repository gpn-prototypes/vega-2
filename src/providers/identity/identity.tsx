import React from 'react';

export type Identity = {
  logout: VoidFunction;
};

type ContextValues = Identity | null;

export const IdentityContext = React.createContext<ContextValues>(null);

export const useIdentity = (): Identity => {
  const identity = React.useContext(IdentityContext);

  if (identity === null) {
    throw new Error('Отсутствует context. Проверьте IdentityProvider');
  }

  return identity;
};

type IdentityProviderProps = {
  identity: Identity;
  children: React.ReactNode;
};

export const IdentityProvider = ({
  identity,
  children,
}: IdentityProviderProps): React.ReactElement => (
  <IdentityContext.Provider value={identity}>{children}</IdentityContext.Provider>
);
