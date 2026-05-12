import { ComponentProps, useId } from 'react'

/** Outline variant of the Halix shard mark (for rare stroke-only use). */
const LogoOutline = (props: ComponentProps<'svg'>) => {
    const uid = useId().replace(/:/g, '')
    const gid = `halix-stroke-${uid}`

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='-36 -36 72 72'
            aria-hidden
            {...props}
        >
            <defs>
                <linearGradient id={gid} x1='0%' y1='0%' x2='100%' y2='100%'>
                    <stop offset='0%' stopColor='#e9d5ff' />
                    <stop offset='100%' stopColor='#7c3aed' />
                </linearGradient>
            </defs>
            <g stroke={`url(#${gid})`} strokeLinejoin='round' strokeWidth='2.2'>
                <path transform='rotate(0)' d='M 0,-24 L 14,14 L -2,6 Z' />
                <path transform='rotate(120)' d='M 0,-24 L 14,14 L -2,6 Z' />
                <path transform='rotate(240)' d='M 0,-24 L 14,14 L -2,6 Z' />
            </g>
        </svg>
    )
}

export default LogoOutline
