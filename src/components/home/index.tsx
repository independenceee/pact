import Footer from "~/components/layout/footer";

export default function Home() {
    return (
        <main>
            <div className="[&>*:nth-child(even)]:bg-smoke-50 dark:[&>*:nth-child(even)]:bg-slate-700"></div>
            <Footer />
        </main>
    );
}
