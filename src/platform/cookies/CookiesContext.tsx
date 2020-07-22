import { createContext, useContext } from 'react';
import Cookie from 'universal-cookie';

export const CookiesContext = createContext<Cookie>(new Cookie());

export const useCookies = (): Cookie => useContext(CookiesContext);
