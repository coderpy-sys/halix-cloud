import { useStoreActions, useStoreState } from '@/state'
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import { LoadingOverlay, Switch } from '@mantine/core'
import { ReactNode } from 'react'

import FlashMessageRender from '@/components/elements/FlashMessageRenderer'
import HalixLogoMark from '@/components/elements/HalixLogoMark'

interface Props {
    title: string
    description: string
    children?: ReactNode
    submitting?: boolean
}

const LoginFormContainer = ({
    title,
    description,
    children,
    submitting,
}: Props) => {
    const theme = useStoreState(state => state.settings.data!.theme)
    const setTheme = useStoreActions(actions => actions.settings.setTheme)

    return (
        <div className='min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-accent-100'>
            <div className='w-full sm:max-w-md'>
                <FlashMessageRender
                    key={'auth:sign_in'}
                    className='px-6 sm:px-0 mb-3'
                />
                <div className='p-6 sm:bg-background sm:shadow-md overflow-hidden sm:rounded-md relative'>
                    <LoadingOverlay visible={submitting || false} />
                    <div className='flex items-center gap-3 mb-2'>
                        <HalixLogoMark
                            className='h-10 w-10 shrink-0'
                            alt=''
                            aria-hidden
                        />
                        <h1 className='text-3xl font-bold text-foreground'>
                            {title}
                        </h1>
                    </div>
                    <p className='description'>{description}</p>
                    <div className='mt-3'>{children}</div>
                </div>
                <div className='flex justify-between px-6 sm:px-0 py-3 w-full'>
                    <p className='text-xs text-accent-500/90'>2024-2026 Halix Cloud</p>
                    <Switch
                        size='md'
                        checked={theme === 'dark'}
                        onChange={() =>
                            setTheme(theme === 'light' ? 'dark' : 'light')
                        }
                        onLabel={<MoonIcon className='w-4 h-4' />}
                        offLabel={<SunIcon className='w-4 h-4 text-amber-200' />}
                    />
                </div>
            </div>
        </div>
    )
}

export default LoginFormContainer