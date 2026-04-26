import { useEffect } from 'react'
import { useUser } from './useUser'

export function ConsoleBanner() {

    const { user } = useUser()

    useEffect(() => {

        const banner = `

        
████████╗ ██████╗ ████████╗██╗   ██╗███████╗
╚══██╔══╝██╔═══██╗╚══██╔══╝██║   ██║██╔════╝
   ██║   ██║   ██║   ██║   ██║   ██║███████╗
   ██║   ██║   ██║   ██║   ╚██╗ ██╔╝╚════██║
   ██║   ╚██████╔╝   ██║    ╚████╔╝ ███████║
   ╚═╝    ╚═════╝    ╚═╝     ╚═══╝  ╚══════╝
 ██████╗  ██████╗ ███╗   ██╗████████╗███████╗██╗  ██╗████████╗
██╔════╝ ██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝╚██╗██╔╝╚══██╔══╝
██║      ██║   ██║██╔██╗ ██║   ██║   █████╗   ╚███╔╝    ██║   
██║      ██║   ██║██║╚██╗██║   ██║   ██╔══╝   ██╔██╗    ██║   
╚██████╗ ╚██████╔╝██║ ╚████║   ██║   ███████╗██╔╝ ██╗   ██║   
 ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝   
`

        console.clear()
        console.log(
            `%c${banner}`,
            'color: #7b7b7b;',
            '\n',
            '\n',
            `${user?.profile?.name ? `Olá ${user?.profile?.name}` : 'Seja bem-vindo(a)'}!`,
            '\n',
            '\n',
            '> Inteligência de interações corporativas',
            '\n',
            '\n',
            '- TOTVS https://www.totvs.com/',
            '\n',
            '- GitHub https://github.com/TOTVScontext/Context',
            '\n',
            '\n'
        )
    })
}