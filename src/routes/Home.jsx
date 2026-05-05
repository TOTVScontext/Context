import Aside from "../components/Aside"
import Header from "../components/Header"
import '../css/home.css'

const Home = () => {
    return (
        <main className="home-main">
            <Aside />
            <section className="content-main">
                <Header />
            </section>
        </main>
    )
}

export default Home
