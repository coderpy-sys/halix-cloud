import router from '@/routers/router'
import { store } from '@/state'
import { NavigationProgress } from '@mantine/nprogress'
import { StoreProvider } from 'easy-peasy'
import { RouterProvider } from 'react-router-dom'

import Spinner from '@/components/elements/Spinner'

import ThemeProvider from '@/components/ThemeProvider'


type SessionUserBootstrap = {
    name: string
    email: string
    root_admin: boolean
    created_at: string
    updated_at: string
}

interface ExtendedWindow extends Window {
    HalixUser?: SessionUserBootstrap
    /** @deprecated Use HalixUser */
    ConvoyUser?: SessionUserBootstrap
    SiteConfiguration?: {
        version: string
    }
}

const App = () => {
    const { HalixUser, ConvoyUser, SiteConfiguration } = window as ExtendedWindow
    const sessionUser = HalixUser ?? ConvoyUser

    if (sessionUser && !store.getState().user.data) {
        store.getActions().user.setUserData({
            name: sessionUser.name,
            email: sessionUser.email,
            rootAdmin: sessionUser.root_admin,
            createdAt: sessionUser.created_at,
            updatedAt: sessionUser.updated_at,
        })
    }

    if (!store.getState().settings.data) {
        store.getActions().settings.setSettings({
            theme:
                localStorage.theme === 'dark' ||
                (!('theme' in localStorage) &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches)
                    ? 'dark'
                    : 'light',
            version: SiteConfiguration!.version,
        })
    }

    return (
        <StoreProvider store={store}>
            <ThemeProvider>
                <NavigationProgress />
                <Spinner.Suspense>
                    <RouterProvider router={router} />
                </Spinner.Suspense>
            </ThemeProvider>
        </StoreProvider>
    )
}

export default App