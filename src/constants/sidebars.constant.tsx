import { MdSpaceDashboard as Dashboard } from "react-icons/md";
import { AiFillCodeSandboxCircle as Proposal } from "react-icons/ai";
import { MdAccountCircle as Account } from "react-icons/md";
import { FaCalendar as Calendar } from "react-icons/fa6";
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
        href: router.proposal,
        Icon: ({ className }: { className?: string }) => {
            return <Account className={cn(className)} />;
        },
        label: "Account",
    },
    {
        href: router.proposal,
        Icon: ({ className }: { className?: string }) => {
            return <Calendar className={cn(className)} />;
        },
        label: "Calendar",
    },
];
