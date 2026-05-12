import { ComponentProps, useId } from 'react'

/**
 * Halix Cloud mark — three crystalline shards (distinct from legacy anchor UI).
 */
const Logo = (props: ComponentProps<'svg'>) => {
    const uid = useId().replace(/:/g, '')
    const gid = `halix-fill-${uid}`

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='-36 -36 72 72'
            aria-hidden
            {...props}
        >
            <defs>
                <linearGradient id={gid} x1='0%' y1='0%' x2='100%' y2='100%'>
                    <stop offset='0%' stopColor='#f5f3ff' />
                    <stop offset='45%' stopColor='#c4b5fd' />
                    <stop offset='100%' stopColor='#6d28d9' />
                </linearGradient>
            </defs>
            <g fill={`url(#${gid})`}>
                <path transform='rotate(0)' d='M 0,-24 L 14,14 L -2,6 Z' />
                <path transform='rotate(120)' d='M 0,-24 L 14,14 L -2,6 Z' />
                <path transform='rotate(240)' d='M 0,-24 L 14,14 L -2,6 Z' />
            </g>
        </svg>
    )
}

export default Logo
