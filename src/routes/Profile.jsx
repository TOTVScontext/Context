import { LogOut } from '@geist-ui/icons'
import Aside from '../components/Aside'
import Header from '../components/Header'
import '../css/profile.css'
import { useUser } from '../hooks/useUser'
import { Link } from 'react-router-dom'

const Profile = () => {

    const { user } = useUser();

    return (
        <main className="profile-main">
            <Header />
            <section className='content-main'>
                <Aside />
                <section className='profile-content'>
                    <article className='profile-card'>
                        <div className='profile-banner' />
                        <section className='profile-header'>
                            <img src={user?.profile?.photo} alt={user?.profile?.name} />
                            <div>
                                <h1>{user?.profile?.name}</h1>
                                <h2>{user?.email}</h2>
                            </div>
                        </section>
                        <section className='profile-info'>
                            <div>
                                <h1>Nome</h1>
                                <input type="text" placeholder='Seu Nome' defaultValue={user?.profile?.name} />
                            </div>

                            <div>
                                <h1>Genero</h1>
                                <select name="gender" value={user?.profile?.gender}>
                                    <option value=""></option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                </select>
                            </div>

                            <div>
                                <h1>País</h1>
                                <input type="text" placeholder='ex: Brasil' defaultValue={user?.profile?.country} />
                            </div>

                            <div>
                                <h1>Posição</h1>
                                <input type="text" placeholder='Seu cargo atual' defaultValue={user?.profile?.position} />
                            </div>

                            <div>
                                <h1>Data de Nascimento</h1>
                                <input type="date" defaultValue={user?.profile?.birthDate} />
                            </div>
                        </section>
                    </article>
                </section>
            </section>
        </main>
    )
}

export default Profile
