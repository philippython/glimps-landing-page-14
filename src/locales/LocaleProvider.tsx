import { flattenMessages } from '@/lib/utils';
import { createContext, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { Messages } from './types';

type locales = {
  "code": string,
  "name": string
}

type LocaleContextType = {
  setLocale: (locale: string) => void;
  availableLocales: locales[];
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState(import.meta.env.VITE_DEFAULT_LOCALE as string);
  const [messages, setMessages] = useState<Messages>({} as Messages);
  const [availableLocales, setAvailableLocales] = useState<locales[]>([]);

  useEffect(() => {
    import('./locales.json').then(module => setAvailableLocales(module.default || module));
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await import(`./${currentLocale}.json`);
      setMessages(messages);
    }
    fetchMessages();
  }, [currentLocale]);

  const setLocale = (locale: string) => {
    setCurrentLocale(locale);
  };

  if (!messages.common) return null;

  return (
    <LocaleContext.Provider value={{ setLocale, availableLocales }}>
      <IntlProvider locale={currentLocale} messages={flattenMessages(messages)}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}