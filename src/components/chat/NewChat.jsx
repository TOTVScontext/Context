import BarChat from "./BarChat"
import { useUser } from "../../hooks/useUser"
import { Aperture } from "@geist-ui/icons";

const NewChat = () => {

    const { user } = useUser();

    return (
        <main className="new-chat-main">
            <section className="new-chat-welcome">
                <Aperture size={40} className="rgb-color" />
                <h1>Olá, {user?.profile?.name}</h1>
            </section>
            <BarChat />
        </main>
    )
}

export default NewChat
