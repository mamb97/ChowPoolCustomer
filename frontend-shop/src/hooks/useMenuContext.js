import { MenuContext } from '../context/MenuContext'
import { useContext } from 'react'

export const useMenuContext = () => {
    const context = useContext(MenuContext)

    if (!context) {
        throw Error('useMenuContext must be used inside an MenuContextProvider')
    }

    return context
}