import Aside from '../components/Aside'
import Header from '../components/Header'
import '../css/profile.css'
import { useUser } from '../hooks/useUser'

const Profile = () => {

    const { user } = useUser();

    return (
        <main className="profile-main">
            <Header />
            <section className='content-main'>
                <Aside />
                <section className='profile-content'>
                    <article className='profile-analysis'>

                    </article>
                    <article className='profile-card'>
                        <div className='profile-card-banner'>
                            <img src='https://t4.ftcdn.net/jpg/06/12/93/29/360_F_612932962_7JtlzAfIXCPFiKdF8ngnSH9SmUP6WQwX.jpg' />
                        </div>
                        <div className='profile-card-info'>
                            <img className='profile-card-photo' src={user?.profile?.photo} />
                            <section className='profile-card-info-content'>
                                <div>
                                    <h1>{user?.profile?.name}</h1>
                                    <h2>{user?.profile?.country}</h2>
                                </div>
                            </section>
                        </div>
                    </article>
                </section>
            </section>
        </main>
    )
}

export default Profile
