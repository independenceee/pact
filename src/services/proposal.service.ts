"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "~/libs/prisma";

/**
 * Retrieves a paginated and optionally filtered list of proposals from the database.
 *
 * @param {Object} params - Parameters for filtering and pagination.
 * @param {number} params.page - The current page number (starting from 1).
 * @param {number} params.pageSize - The number of proposals per page.
 * @param {string} [params.search] - Optional keyword to search proposals by title or description.
 * @param {string} [params.walletAddress] - Optional wallet address to filter proposals by creator.
 *
 * @returns {Promise<{
 *   success: boolean;
 *   proposals?: any[];
 *   total?: number;
 *   totalPages?: number;
 *   error?: string;
 * }>}
 * - success: Indicates whether the operation was successful.
 * - proposals: Array of proposals with associated user and transaction data.
 * - total: Total number of proposals that match the query.
 * - totalPages: Total number of pages based on `total` and `pageSize`.
 * - error: Error message if the operation fails.
 *
 * This function supports:
 *  - Pagination (`page`, `pageSize`)
 *  - Keyword search (`search` in title or description, case-insensitive)
 *  - Filtering by wallet address (`walletAddress`)
 */
export async function getProposals({
    page,
    pageSize,
    search,
    walletAddress,
    status,
}: {
    page: number;
    pageSize: number;
    search?: string;
    walletAddress?: string;
    status?: string;
}) {
    try {
        const where: any = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { status: { contains: status, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }
        if (walletAddress) {
            where.user = { address: walletAddress };
        }

        const total = await prisma.proposal.count({ where });
        const totalPages = Math.ceil(total / pageSize);

        const proposals = await prisma.proposal.findMany({
            where,
            include: {
                user: true,
                transactions: true,
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                startTime: "desc",
            },
        });

        return { success: true, proposals, total, totalPages };
    } catch (error) {
        console.error("Error fetching proposals:", error);
        return { success: false, error: "Failed to fetch proposals" };
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * @function createProposal
 * @description
 * Creates a new proposal and links it to a user based on their wallet address.
 *
 * @param {Object} params - The proposal information.
 * @param {string} params.title - The title of the proposal.
 * @param {string} params.image - The image URL of the proposal.
 * @param {string} params.description - The detailed description of the proposal.
 * @param {string} params.status - The current status of the proposal.
 * @param {string} params.destination - The target destination or address.
 * @param {number} params.target - The goal amount or target value.
 * @param {number} params.current - The current progress value.
 * @param {number} params.participants - The number of participants.
 * @param {Date} params.startTime - The proposal's start time.
 * @param {Date} params.endTime - The proposal's end time.
 * @param {string} params.walletAddress - The wallet address of the proposal creator.
 *
 * @returns {Promise<{ success: boolean; proposal?: any; error?: string }>}
 * Returns an object indicating success or failure, and the created proposal if successful.
 *
 * @throws {Error} If the user is not found or the creation process fails.
 */
export async function createProposal({
    title,
    current,
    description,
    destination,
    endTime,
    image,
    participants,
    startTime,
    status,
    target,
    walletAddress,
}: {
    title: string;
    image: string;
    description: string;
    status: string;
    destination: string;
    target: number;
    current: number;
    participants: number;
    startTime: Date;
    endTime: Date;
    walletAddress: string;
}) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                address: walletAddress,
            },
        });

        if (!user) {
            throw new Error("User not found with this wallet address");
        }

        const proposal = await prisma.proposal.create({
            data: {
                title: title,
                image: image,
                description: description,
                status: status,
                destination: destination,
                target: target,
                current: current,
                participants: participants,
                startTime: startTime,
                endTime: endTime,
                userId: user.id, // Sử dụng userId của user tìm được
            },
            include: {
                user: true,
                transactions: true,
            },
        });
        return { success: true, proposal };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Failed to create proposal");
    } finally {
        await prisma.$disconnect();
    }
}

export async function updateProposal(
    id: string,
    data: {
        title?: string;
        image?: string;
        description?: string;
        status?: string;
        destination?: string;
        target?: number;
        current?: number;
        participants?: number;
        startTime?: Date;
        endTime?: Date;
    },
) {
    try {
        const proposal = await prisma.proposal.update({
            where: { id },
            data: {
                title: data.title,
                image: data.image,
                description: data.description,
                status: data.status,
                destination: data.destination,
                target: data.target,
                current: data.current,
                participants: data.participants,
                startTime: data.startTime,
                endTime: data.endTime,
            },
            include: {
                user: true,
                transactions: true,
            },
        });
        return { success: true, proposal };
    } catch (error) {
        console.error("Error updating proposal:", error);
        return { success: false, error: "Failed to update proposal" };
    } finally {
        await prisma.$disconnect();
    }
}

export async function getProposalByID(id: string) {
    try {
        const proposal = await prisma.proposal.findUnique({
            where: { id },
            include: {
                user: true,
                transactions: true,
            },
        });
        if (!proposal) {
            return { success: false, error: "Proposal not found" };
        }
        return { success: true, proposal };
    } catch (error) {
        console.error("Error fetching proposal:", error);
        return { success: false, error: "Failed to fetch proposal" };
    } finally {
        await prisma.$disconnect();
    }
}

export async function deleteProposal(id: string) {
    try {
        const proposal = await prisma.proposal.delete({
            where: { id },
        });
        return { success: true, message: "Proposal deleted successfully" };
    } catch (error) {
        console.error("Error deleting proposal:", error);
        return { success: false, error: "Failed to delete proposal" };
    } finally {
        await prisma.$disconnect();
    }
}
