import { getStorage } from 'app/utils/storage';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { createContext, FC, PropsWithChildren, useEffect, useState } from 'react'

import en from '../../locales/en.json'
import ru from '../../locales/ru.json'

interface IContext {
    language: string, 
    setLanguage: React.Dispatch<React.SetStateAction<string>> | any
    i18n: I18n
}

export const LangContext = createContext<IContext>({} as any);

const LangProvider: FC<PropsWithChildren> = ({ children }) => {
    const [language, setLanguage] = useState('ru')

    const i18n = new I18n({en, ru});

    useEffect(() => {
        const storageLang = getStorage('lang')
        if(storageLang) setLanguage(storageLang)
        else setLanguage(getLocales()[0].languageCode as any)
        i18n.locale = language;
        i18n.defaultLocale = 'ru'
    }, [])

    i18n.locale = language

    return (
     <LangContext.Provider value={{language, setLanguage, i18n}}>
        {children}
     </LangContext.Provider>
    )
}
export default LangProvider