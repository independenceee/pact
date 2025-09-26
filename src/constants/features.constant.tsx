import { Activity, Lock, Zap, Compass, LineChart, Shield } from "lucide-react";

export const features = [
    {
        icon: <Activity className="h-6 w-6" />,
        title: "Real-time Hydra Monitoring",
        description:
            "Track Cardano Hydra heads and state channels with live updates for scalable off-chain processing.",
    },
    {
        icon: <Lock className="h-6 w-6" />,
        title: "Ouroboros Security",
        description:
            "Leverage Cardano's proof-of-stake protocol with Hydra's secure multi-party computations for asset protection.",
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: "Instant Hydra Transactions",
        description:
            "Achieve sub-second settlements using Hydra heads for high-throughput, low-latency Cardano interactions.",
    },
    {
        icon: <Compass className="h-6 w-6" />,
        title: "Plutus Smart Contracts",
        description:
            "Build and optimize dApps on Cardano with Plutus scripts integrated into Hydra for efficient scaling.",
    },
    {
        icon: <LineChart className="h-6 w-6" />,
        title: "ADA Price Alerts",
        description: "Set customizable notifications for Cardano ADA fluctuations, powered by on-chain oracles.",
    },
    {
        icon: <Shield className="h-6 w-6" />,
        title: "Cold Wallet Integration",
        description:
            "Store ADA and assets in hardware wallets compatible with Cardano, enhanced by Hydra's offline capabilities.",
    },
];
