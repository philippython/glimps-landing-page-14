
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
  // Set a default locale explicitly rather than relying on the env variable
  const defaultLocale = import.meta.env.VITE_DEFAULT_LOCALE || 'en';
  const [currentLocale, setCurrentLocale] = useState(defaultLocale);
  const [messages, setMessages] = useState<Partial<Messages>>({});
  const [availableLocales, setAvailableLocales] = useState<locales[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLocales = async () => {
      try {
        const response = await fetch('/locales/locales.json');
        const data = await response.json();
        setAvailableLocales(data);
      } catch (error) {
        console.error('Failed to load available locales:', error);
        // Provide fallback locales
        setAvailableLocales([
          { code: 'en', name: 'English' },
          { code: 'ru', name: 'Русский' }
        ]);
      }
    };
    loadLocales();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        // Make sure we're using a valid locale string
        const localeToLoad = currentLocale || defaultLocale;
        const response = await fetch(`/locales/${localeToLoad}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load locale: ${localeToLoad}`);
        }
        const data = await response.json();
        setMessages(data as Partial<Messages>);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Set some basic fallback messages
        setMessages({
          common: {
            loading: 'Loading...',
            error: 'An error occurred'
          }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentLocale) {
      loadMessages();
    }
  }, [currentLocale, defaultLocale]);

  const setLocale = (locale: string) => {
    setCurrentLocale(locale);
  };

  useEffect(() => {
    console.info(message());
  }, []);

  // Show a loading state until we have messages
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Make sure we have minimal required messages before rendering
  if (!messages.common) {
    return <div className="flex items-center justify-center h-screen">Loading application...</div>;
  }

  return (
    <LocaleContext.Provider value={{ setLocale, availableLocales, currentLocale }}>
      <IntlProvider locale={currentLocale} messages={flattenMessages(messages as Messages)}>
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
