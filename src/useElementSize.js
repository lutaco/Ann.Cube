import {useCallback, useState} from 'react'
import {useEventListener, useIsomorphicLayoutEffect} from 'usehooks-ts';

export const useElementWidth = () => {
    const [ref, setRef] = useState(null)
    const [size, setWidth] = useState(0);

    const handleSize = useCallback(() => {
        setWidth(ref?.offsetWidth)
        // eslint-disable-next-line
    }, [ref?.offsetWidth])

    useEventListener('resize', handleSize)
    useIsomorphicLayoutEffect(() => {
        handleSize()
    }, [ref?.offsetWidth])

    return [setRef, size]
}