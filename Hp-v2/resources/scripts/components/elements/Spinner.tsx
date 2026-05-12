import styled from '@emotion/styled'
import { ReactNode, Suspense } from 'react'
import tw from 'twin.macro'

import HalixLogoMark from '@/components/elements/HalixLogoMark'

interface Props {
    screen?: boolean
    flat?: boolean
}

interface Spinner extends React.FC<Props> {
    Suspense: React.FC<{
        children: ReactNode
        screen?: boolean
    }>
}

const SpinWrap = styled.div`
    ${tw`grid place-items-center`}
    animation: halix-spin 1.05s linear infinite;
    filter: drop-shadow(0 0 12px rgba(167, 139, 250, 0.35));

    img {
        ${tw`w-14 h-14`}
    }

    @keyframes halix-spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`

const Spinner: Spinner = ({ screen, flat }: Props) => {
    return (
        <div
            className={`grid place-items-center w-full ${
                screen ? 'h-screen' : 'h-40'
            } ${flat ? 'bg-accent-1' : ''}`}
        >
            <SpinWrap>
                <HalixLogoMark
                    className='h-14 w-14'
                    alt=''
                    aria-hidden
                />
            </SpinWrap>
        </div>
    )
}

Spinner.Suspense = ({ children, screen }) => {
    return (
        <Suspense fallback={<Spinner screen={screen} />}>{children}</Suspense>
    )
}

export default Spinner
