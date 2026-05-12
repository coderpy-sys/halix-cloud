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
    SiteConfiguration?: {
        version: string
    }
}

const App = () => {
    const { HalixUser, SiteConfiguration } = window as ExtendedWindow

    if (HalixUser && !store.getState().user.data) {
        store.getActions().user.setUserData({
            name: HalixUser.name,
            email: HalixUser.email,
            rootAdmin: HalixUser.root_admin,
            createdAt: HalixUser.created_at,
            updatedAt: HalixUser.updated_at,
        })
    }

    if (!store.getState().settings.data) {
        store.getActions().settings.setSettings({
            theme:
                localStorage.theme === 'light' ? 'light' : 'dark',
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