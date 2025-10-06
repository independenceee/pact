import { MdSpaceDashboard as Dashboard } from "react-icons/md";
import { AiFillCodeSandboxCircle as Proposal } from "react-icons/ai";
import { VscAccount as Account } from "react-icons/vsc";
import { cn } from "~/libs/utils";
import { router } from "./router.constant";

export const sidebars = [
    {
        href: router.dashboard,
        Icon: ({ className }: { className?: string }) => {
            return <Dashboard className={cn(className)} />;
        },
        label: "Dashboard",
    },
    {
        href: router.proposal,
        Icon: ({ className }: { className?: string }) => {
            return <Proposal className={cn(className)} />;
        },
        label: "Proposal",
    },
    {
        href: router.account,
        Icon: ({ className }: { className?: string }) => {
            return <Account className={cn(className)} />;
        },
        label: "Account",
    },
];
