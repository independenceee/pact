"use server";

import prisma from "~/libs/prisma";

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

// Cập nhật một Proposal theo ID
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

// Lấy thông tin Proposal theo ID
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

// Lấy danh sách tất cả Proposals
export async function getProposals() {
    try {
        const proposals = await prisma.proposal.findMany({
            include: {
                user: true,
                transactions: true,
            },
        });
        return { success: true, proposals };
    } catch (error) {
        console.error("Error fetching proposals:", error);
        return { success: false, error: "Failed to fetch proposals" };
    } finally {
        await prisma.$disconnect();
    }
}

// Xóa một Proposal theo ID
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
