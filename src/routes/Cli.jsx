import '../css/cli.css'
import { ChevronLeft } from '@carbon/icons-react'
import { useNavigate } from 'react-router-dom';

const Cli = () => {

    const navigate = useNavigate();

    return (
        <main className="cli-main">
            <header className='cli-header'>
                <p onClick={() => navigate(-1)}><ChevronLeft size={16} />Voltar</p>
            </header>
        </main>
    )
}

export default Cli
