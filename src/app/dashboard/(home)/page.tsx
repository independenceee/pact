"use client";
import { motion } from "framer-motion";
import Status from "~/components/status";

export default function Page() {
    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8 relative overflow-hidden"
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
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-purple-500/5 blur-3xl"></div>
                <div className="absolute -bottom-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-blue-500/5 blur-3xl"></div>
                <div className="absolute top-[20%] left-[50%] w-[40%] h-[40%] rounded-full bg-purple-500/3 blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Status Section */}
                <motion.section
                    className="mb-8"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                >
                    <Status />
                </motion.section>

                {/* Stats Overview */}
                <motion.section
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                >
                    {[
                        { title: "Total Projects", value: "24", change: "+12%", icon: "📊" },
                        { title: "Active Participants", value: "1.2K", change: "+18%", icon: "👥" },
                        { title: "Total Value Locked", value: "486K ADA", change: "+25%", icon: "💰" },
                        { title: "Success Rate", value: "94%", change: "+5%", icon: "📈" },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-lg p-6 hover:border-purple-500/30 hover:bg-gray-800/60 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-2xl group-hover:animate-bounce">{stat.icon}</span>
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className="text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded-full">
                                    {stat.change} vs last month
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </motion.section>

                {/* Chart and Quick Actions */}
                <div className="grid grid-cols-1 gap-8 mb-8">
                    {/* Chart */}

                    {/* Quick Actions */}
                    <motion.div
                        className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-lg p-6"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                        }}
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                        <div className="space-y-4">
                            {[
                                {
                                    title: "Create New Project",
                                    desc: "Start a new community initiative",
                                    icon: "🚀",
                                    color: "from-purple-500/20 to-blue-500/20",
                                },
                                {
                                    title: "View Analytics",
                                    desc: "Check your project metrics",
                                    icon: "📊",
                                    color: "from-green-500/20 to-emerald-500/20",
                                },
                                {
                                    title: "Manage Funds",
                                    desc: "Handle your ADA transactions",
                                    icon: "💎",
                                    color: "from-blue-500/20 to-cyan-500/20",
                                },
                                {
                                    title: "Community Chat",
                                    desc: "Connect with participants",
                                    icon: "💬",
                                    color: "from-purple-500/20 to-pink-500/20",
                                },
                            ].map((action, index) => (
                                <button
                                    key={index}
                                    className="w-full flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-purple-500/10 hover:scale-[1.02] transform transition-all duration-300 relative overflow-hidden group"
                                >
                                    <div
                                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <span className="text-2xl group-hover:animate-bounce">{action.icon}</span>
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="text-white font-medium group-hover:text-purple-400 transition-colors">
                                            {action.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm">{action.desc}</p>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Recent Projects */}
                <motion.section
                    className="mb-8"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                >
                    <h2 className="text-xl font-semibold text-white mb-6">Recent Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                        {[1, 2].map((project) => (
                            <div
                                key={project}
                                className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-lg p-6 hover:border-purple-500/30 hover:bg-gray-800/60 hover:scale-[1.02] transform transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                            <span className="text-xl">🎯</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium">Project {project}</h3>
                                            <p className="text-gray-400 text-sm">Created 2 days ago</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 text-xs font-medium text-green-400 bg-green-400/10 rounded-full">
                                        Active
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                                        <span>Progress</span>
                                        <span>65%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: "65%" }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((user) => (
                                            <img
                                                key={user}
                                                className="w-8 h-8 rounded-full border-2 border-gray-800"
                                                src={`https://randomuser.me/api/portraits/${
                                                    user % 2 ? "men" : "women"
                                                }/${user}.jpg`}
                                                alt={`User ${user}`}
                                            />
                                        ))}
                                    </div>
                                    <button className="text-purple-400 hover:text-purple-300 transition-colors">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Recent Activity */}
                <motion.section
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                >
                    <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-lg overflow-hidden">
                        <div className="divide-y divide-gray-700">
                            {[
                                {
                                    type: "transaction",
                                    user: "Alice Chen",
                                    action: "contributed",
                                    amount: "150 ADA",
                                    time: "2 hours ago",
                                    icon: "💎",
                                },
                                {
                                    type: "milestone",
                                    user: "Project X",
                                    action: "reached milestone",
                                    amount: "Phase 1 Complete",
                                    time: "5 hours ago",
                                    icon: "🎯",
                                },
                                {
                                    type: "member",
                                    user: "John Doe",
                                    action: "joined",
                                    amount: "Development Team",
                                    time: "1 day ago",
                                    icon: "👤",
                                },
                                {
                                    type: "update",
                                    user: "Sarah Kim",
                                    action: "updated",
                                    amount: "Project Documentation",
                                    time: "2 days ago",
                                    icon: "📝",
                                },
                            ].map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center p-4 hover:bg-purple-500/5 transition-all duration-300 group"
                                >
                                    <span className="text-2xl mr-4">{activity.icon}</span>
                                    <div className="flex-1">
                                        <p className="text-white">
                                            <span className="font-medium">{activity.user}</span>{" "}
                                            <span className="text-gray-400">{activity.action}</span>{" "}
                                            <span className="font-medium">{activity.amount}</span>
                                        </p>
                                        <p className="text-gray-400 text-sm">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
}
