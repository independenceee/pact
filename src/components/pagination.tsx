"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
};

const Pagination = ({ currentPage, totalPages, setCurrentPage }: Props) => {
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col sm:flex-row justify-center items-center mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
                <Button
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 border border-purple-400/20 text-gray-200 hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400 hover:text-white disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-600 transition-all duration-300"
                >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-purple-400" />
                    <span className="hidden sm:inline">First</span>
                    <span className="sm:hidden">1</span>
                </Button>

                <Button
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={handlePreviousPage}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 border border-purple-400/20 text-gray-200 hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400 hover:text-white disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-600 transition-all duration-300"
                >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-purple-400" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">←</span>
                </Button>
            </div>

            <span className="px-2 sm:px-4 py-1.5 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-300 bg-gray-800 border border-purple-400/20 rounded-lg">
                {currentPage} of {totalPages}
            </span>

            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
                <Button
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 border border-purple-400/20 text-gray-200 hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400 hover:text-white disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-600 transition-all duration-300"
                >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">→</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-purple-400" />
                </Button>

                <Button
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 border border-purple-400/20 text-gray-200 hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400 hover:text-white disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-600 transition-all duration-300"
                >
                    <span className="hidden sm:inline">Last</span>
                    <span className="sm:hidden">{totalPages}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-purple-400" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
