"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createProposal } from "~/services/proposal.service";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useWallet } from "~/hooks/use-wallet";
import { toast } from "sonner";

interface ProposalFormData {
    title: string;
    image?: string;
    description: string;
    status: "open" | "closed" | "pending";
    destination: string;
    target: number;
    current: number;
    participants: number;
    startTime: string;
    endTime: string;
}

const proposalSchema = z
    .object({
        title: z.string().min(1, "Title is required"),
        image: z.string().url("Image must be a valid URL").optional().or(z.literal("")),
        description: z.string().min(1, "Description is required"),
        status: z.enum(["open", "closed", "pending"], { message: "Status must be one of: open, closed, pending" }),
        destination: z.string().min(1, "Destination is required"),
        target: z.number().int().nonnegative("Target must be a non-negative integer"),
        current: z.number().int().nonnegative("Current amount must be a non-negative integer"),
        participants: z.number().int().nonnegative("Participants must be a non-negative integer"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
    })
    .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
        message: "End time must be after start time",
        path: ["endTime"],
    });

export default function CreateProposal() {
    const [imageError, setImageError] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const { address } = useWallet();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ProposalFormData>({
        resolver: zodResolver(proposalSchema),
        defaultValues: {
            title: "",
            image: "",
            description: "",
            status: "open",
            destination: "",
            target: 0,
            current: 0,
            participants: 0,
            startTime: "",
            endTime: "",
        },
    });

    const uploadImageMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
            const { data } = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData,
            );
            return data.secure_url as string;
        },
        onSuccess: (url) => {
            setUploadedImage(url);
            setValue("image", url, { shouldValidate: true });
            setImageError(null);
        },
        onError: () => {
            setImageError("Failed to upload image.");
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageError(null);
        const file = e.target.files?.[0];
        if (!file) return;
        uploadImageMutation.mutate(file);
    };

    const { mutate, isPending } = useMutation({
        mutationFn: createProposal,
        onSuccess: () => {
            toast.success("Proposal created successfully!");
            setUploadedImage(null);
            setImageError(null);
            reset();
        },
        onError: (error: Error) => {
            alert(error.message || "Failed to create proposal.");
        },
    });

    const onSubmit = async (data: ProposalFormData) => {
        if (!uploadedImage && !data.image) {
            setImageError("Please upload an image");
            return;
        }

        const finalData = {
            ...data,
            image: uploadedImage || data.image || "",
        };

        mutate({
            title: finalData.title,
            image: uploadedImage || finalData.image || "",
            description: finalData.description,
            status: finalData.status,
            destination: finalData.destination,
            target: finalData.target,
            current: finalData.current,
            participants: finalData.participants,
            startTime: new Date(finalData.startTime),
            endTime: new Date(finalData.endTime),
            walletAddress: address as string,
        });
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-purple-500/5 blur-3xl" />
                <div className="absolute -bottom-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute top-[20%] left-[50%] w-[40%] h-[40%] rounded-full bg-purple-500/3 blur-3xl" />
            </div>
            <div className="max-w-2xl mx-auto relative">
                <div className="text-center space-y-2 mb-12">
                    <motion.h1
                        className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Create a New Proposal
                    </motion.h1>
                    <motion.p
                        className="text-gray-400 text-sm sm:text-base"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Fill in the details below to start your community initiative
                    </motion.p>
                </div>
                <motion.form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 sm:p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-200">Proposal Title</label>
                        <input
                            type="text"
                            {...register("title")}
                            className={`w-full p-2.5 rounded-lg bg-gray-800/50 border-2 ${
                                errors.title ? "border-red-500" : "border-gray-700"
                            } text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                            placeholder="Enter proposal title"
                        />
                        {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
                    </div>
                    {/* Image Upload */}
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-200">Image Upload</label>
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer bg-gray-800/50 hover:border-purple-500 ${
                                uploadImageMutation.isPending ? "opacity-60 pointer-events-none" : ""
                            }`}
                            onClick={() =>
                                !uploadImageMutation.isPending &&
                                document.getElementById("proposal-image-input")?.click()
                            }
                            style={{ minHeight: "140px" }}
                        >
                            <input
                                id="proposal-image-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={uploadImageMutation.isPending}
                            />
                            {!uploadedImage && !uploadImageMutation.isPending && (
                                <>
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-purple-400 mb-3">
                                        <svg
                                            className="w-8 h-8"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                                            />
                                        </svg>
                                    </div>
                                    <span className="block text-sm text-gray-400 mb-1">
                                        Drag & drop or click to upload
                                    </span>
                                    <span className="text-xs text-gray-500">PNG, JPG, WebP, SVG (max 10MB)</span>
                                </>
                            )}
                            {uploadImageMutation.isPending && (
                                <div className="flex flex-col items-center">
                                    <svg
                                        className="animate-spin h-8 w-8 text-purple-400 mb-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        ></path>
                                    </svg>
                                    <span className="text-sm text-gray-400">Uploading image...</span>
                                </div>
                            )}
                            {uploadedImage && !uploadImageMutation.isPending && (
                                <div className="flex flex-col items-center w-full">
                                    <img
                                        src={uploadedImage}
                                        alt="Uploaded"
                                        className="w-32 h-32 object-cover rounded-lg border border-gray-700 shadow-md mb-2"
                                    />
                                    <span className="text-xs text-green-400">Image uploaded successfully!</span>
                                    <button
                                        type="button"
                                        className="mt-2 text-xs text-red-400 hover:underline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setUploadedImage(null);
                                            setValue("image", "", { shouldValidate: true });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                        {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image.message}</p>}
                        {imageError && <p className="text-red-400 text-xs mt-1">{imageError}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-200">Description</label>
                        <textarea
                            {...register("description")}
                            className={`w-full p-2.5 rounded-lg bg-gray-800/50 border-2 ${
                                errors.description ? "border-red-500" : "border-gray-700"
                            } text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                            rows={5}
                            placeholder="Describe your proposal"
                        />
                        {errors.description && <p className="text-red-400 text-xs">{errors.description.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-200">Status</label>
                        <select
                            {...register("status")}
                            className={`w-full p-2.5 rounded-lg bg-gray-800/50 border-2 ${
                                errors.status ? "border-red-500" : "border-gray-700"
                            } text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                        >
                            <option value="">Select status</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="pending">Pending</option>
                        </select>
                        {errors.status && <p className="text-red-400 text-xs">{errors.status.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-200">Destination</label>
                        <input
                            type="text"
                            {...register("destination")}
                            className={`w-full p-2.5 rounded-lg bg-gray-800/50 border-2 ${
                                errors.destination ? "border-red-500" : "border-gray-700"
                            } text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                            placeholder="Enter destination"
                        />
                        {errors.destination && <p className="text-red-400 text-xs">{errors.destination.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-200">Target Amount</label>
                            <input
                                type="number"
                                {...register("target", { valueAsNumber: true })}
                                className={`w-full p-2.5 rounded-lg bg-gray-800/50 border-2 ${
                                    errors.target ? "border-red-500" : "border-gray-700"
                                } text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                                placeholder="Enter target amount"
                            />
                            {errors.target && <p className="text-red-400 text-xs">{errors.target.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-200">Participants</label>
                            <input
                                type="number"
                                {...register("participants", { valueAsNumber: true })}
                                className={`w-full p-2.5 rounded-lg bg-gray-800/50 border-2 ${
                                    errors.participants ? "border-red-500" : "border-gray-700"
                                } text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                                placeholder="Enter number of participants"
                            />
                            {errors.participants && (
                                <p className="text-red-400 text-xs">{errors.participants.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-200">Start Time</label>
                            <input
                                type="datetime-local"
                                {...register("startTime")}
                                className={`w-full p-2.5 rounded-lg bg-gray-800/50 border-2 ${
                                    errors.startTime ? "border-red-500" : "border-gray-700"
                                } text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                            />
                            {errors.startTime && <p className="text-red-400 text-xs">{errors.startTime.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-200">End Time</label>
                            <input
                                type="datetime-local"
                                {...register("endTime")}
                                className={`w-full p-2.5 rounded-lg bg-gray-800/50 border-2 ${
                                    errors.endTime ? "border-red-500" : "border-gray-700"
                                } text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                            />
                            {errors.endTime && <p className="text-red-400 text-xs">{errors.endTime.message}</p>}
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-700/30">
                        <motion.button
                            type="submit"
                            className="relative w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group"
                            disabled={isPending}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="relative z-10 text-base">Submit Proposal</span>
                            <svg
                                className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5-5 5M5 7l5 5-5 5"
                                />
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.button>
                        {isPending && (
                            <p className="text-center text-sm text-gray-400 mt-2">Uploading your proposal...</p>
                        )}
                    </div>
                </motion.form>
            </div>
        </motion.div>
    );
}
