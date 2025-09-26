import { PropsWithChildren } from "react";
import Header from "~/components/header";
import Footer from "~/components/footer";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <main>
            <Header />
            <div>{children}</div>
            <Footer />
        </main>
    );
}
