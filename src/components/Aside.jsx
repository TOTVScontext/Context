import { LogOut } from "@geist-ui/icons"
import { useUser } from "../hooks/useUser";

const Aside = () => {

    const { user } = useUser();

    return (
        <aside className="aside-main">
            <section className="aside-nav">
                <nav>
                    <ul>
                        <Link to=''></Link>
                        <Link to=''></Link>
                        <Link to=''></Link>
                        <Link to=''></Link>
                        <Link to=''></Link>
                        <Link to=''></Link>
                    </ul>
                </nav>
                <Link to=''></Link>
                <Link to=''></Link>
            </section>
            <section>
                <button><LogOut size={17} /></button>
                <Link><img src={user?.profile?.photo} /></Link>
            </section>
        </aside>
    )
}

export default Aside
