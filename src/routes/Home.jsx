import Aside from "../components/Aside"
import Header from "../components/Header"

const Home = () => {
    return (
        <main className="home-main">
            <Header />
            <section className="content-main">
                <Aside />
            </section>
        </main>
    )
}

export default Home
