import { ComponentPropsWithoutRef } from 'react'

export type HalixLogoMarkProps = ComponentPropsWithoutRef<'img'> & {
    /** Public URL; default is copied from Cursor workspace assets into `public/halix-logo.png`. */
    src?: string
}

/**
 * Raster Halix mark (transparent PNG). Prefer this over the SVG shard when
 * you need the exact brand artwork from design.
 */
const HalixLogoMark = ({
    src = '/halix-logo.png',
    className = '',
    alt = 'Halix Cloud',
    ...rest
}: HalixLogoMarkProps) => {
    return (
        <img
            src={src}
            alt={alt}
            draggable={false}
            decoding='async'
            className={`object-contain select-none ${className}`.trim()}
            {...rest}
        />
    )
}

export default HalixLogoMark
