import Image from "next/image";
import Link from "next/link";

type Props = {
    id: string;
    title: string;
    image: string;
    description: string;
    status: string;
    target: number;
    current: number;
    startTime: Date;
};

export default function Proposal(proposal: Props) {
    const progressPercentage = Math.min(
        100,
        (((proposal.current as number) / proposal.target) as number) * 100,
    ).toFixed(0);
    const formattedDate = new Date(proposal.startTime);
    const day = formattedDate.getDate();
    const month = formattedDate.toLocaleString("default", { month: "short" });

    return (
        <article className="group relative rounded-xl overflow-hidden bg-gray-800/90 backdrop-blur-lg border border-gray-700/50 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 max-w-sm mx-auto flex flex-col">
            {/* Image Section */}
            <div className="relative">
                <Link href={`/paction/${proposal.id}`} aria-label={`View details for ${proposal.title}`}>
                    <img src={proposal.image} alt={proposal.title} className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                {/* Status Badge */}
                <span className="absolute bottom-3 left-3 bg-purple-600/90 text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                    {proposal.status}
                </span>

                {/* Date Circle */}
                <div className="absolute top-3 right-3 bg-gray-900/90 text-white rounded-full h-14 w-14 flex flex-col items-center justify-center group-hover:bg-purple-600/90 transition-colors duration-300">
                    <span className="font-bold text-sm">{day}</span>
                    <span className="text-xs uppercase">{month}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                    <Link href={`/paction/${proposal.id}`}>
                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">
                            {proposal.title}
                        </h3>
                    </Link>
                    <p className="mt-2 text-gray-300 text-sm line-clamp-3">{proposal.description}</p>
                </div>

                <div className="mt-4">
                    <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                        Funded: {progressPercentage}% (${proposal.current.toLocaleString()} / $
                        {proposal.target.toLocaleString()})
                    </p>
                </div>
            </div>
        </article>
    );
}
