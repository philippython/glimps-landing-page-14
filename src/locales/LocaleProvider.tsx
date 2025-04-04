import { flattenMessages } from '@/lib/utils';
import { createContext, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { Messages } from './types';
import message from '@/components/ui/message';

type locales = {
  "code": string,
  "name": string
}

type LocaleContextType = {
  setLocale: (locale: string) => void;
  availableLocales: locales[];
  currentLocale: string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState(import.meta.env.VITE_DEFAULT_LOCALE as string);
  const [messages, setMessages] = useState<Messages>({} as Messages);
  const [availableLocales, setAvailableLocales] = useState<locales[]>([]);

  useEffect(() => {
    const loadLocales = async () => {
      const response = await fetch('/locales/locales.json');
      return await response.json();
    };
    loadLocales().then(module => setAvailableLocales(module.default || module));
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      const messages = await fetch(`/locales/${currentLocale}.json`);
      return await messages.json();
    };
    loadMessages().then(messages => setMessages(messages));
  }, [currentLocale]);

  const setLocale = (locale: string) => {
    setCurrentLocale(locale);
  };

  useEffect(() => {
    console.info(message());
  }, []);

  if (!messages.common || !availableLocales) return null;

  return (
    <LocaleContext.Provider value={{ setLocale, availableLocales, currentLocale }}>
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