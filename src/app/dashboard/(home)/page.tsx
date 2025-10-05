"use client";
import { motion } from "framer-motion";
import Status from "~/components/status";

export default function Page() {
    return (
        <motion.aside
            className="container mx-auto "
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2, ease: "easeOut" },
                },
            }}
            initial="hidden"
            animate="visible"
        >
            <div className=" mx-auto">
                <motion.section
                    className="w-full mb-6"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                >
                    <Status />
                </motion.section>
            </div>
        </motion.aside>
    );
}
