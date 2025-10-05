"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

// Define TypeScript interface for form data
interface ProposalFormData {
    title: string;
    image?: string;
    description: string;
    status: string;
    destination: string;
    target: number;
    current: number;
    participants: number;
    startTime: string;
    endTime: string;
}

// Define Zod schema for validation
const proposalSchema = z
    .object({
        title: z.string().min(1, "Title is required"),
        image: z.string().url("Image must be a valid URL").optional().or(z.literal("")),
        description: z.string().min(1, "Description is required"),
        status: z.string().min(1, "Status is required"),
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
    const [uploading, setUploading] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProposalFormData>({
        resolver: zodResolver(proposalSchema),
        defaultValues: {
            title: "",
            image: "",
            description: "",
            status: "",
            destination: "",
            target: 0,
            current: 0,
            participants: 0,
            startTime: "",
            endTime: "",
        },
    });

    const handleUploadCallback = (result: any, widget: any) => {
        if (result.event === "success") {
            const info = result.info as { secure_url: string; public_id: string };
            setUploadedImage(info.secure_url);
            setValue("image", info.secure_url, { shouldValidate: true });
            setImageError(null);
            setUploading(false);
            widget.close();
        } else if (result.event === "error") {
            setImageError("Failed to upload image. Please try again.");
            setUploading(false);
        }
    };

    const handleOpenWidget = (widget: any) => {
        setUploading(true);
        setImageError(null);
    };

    const onSubmit = async (data: ProposalFormData) => {
        console.log("Form submitted:", data);
        // Add logic to send data to your backend API
    };

    return (
        <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <h1 className="text-2xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Create a New Proposal
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-200">Image Upload</label>
                    <div className=" border-t border-gray-800">
                        <div className="">
                            <div className="border rounded-xl border-dashed border-purple-500">
                                <div className="relative">
                                    <CldUploadWidget
                                        uploadPreset="hydrapact"
                                        options={{
                                            sources: ["local"],
                                            multiple: false,
                                            maxFiles: 1,
                                            resourceType: "image",
                                            maxFileSize: 5 * 1024 * 1024, // 5MB
                                            cropping: false,
                                            showAdvancedOptions: false,
                                        }}
                                        onOpen={handleOpenWidget}
                                        onUpload={handleUploadCallback}
                                    >
                                        {({ open }) => (
                                            <div
                                                onClick={() => open?.()}
                                                className={`cursor-pointer flex flex-col items-center p-5  bg-gray-800/50 rounded-xl transition-all duration-200 ${
                                                    uploading ? "opacity-50" : ""
                                                }`}
                                            >
                                                <div className="mb-5 flex justify-center">
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-gray-400">
                                                        <svg
                                                            className="fill-current"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 29 28"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <h4 className="mb-3 font-semibold text-sm text-gray-100">
                                                    {uploading ? "Uploading..." : "Drag & Drop Files Here"}
                                                </h4>
                                                <span className="text-center mb-5 block w-full max-w-[290px] text-xs text-gray-400">
                                                    Drag and drop your PNG, JPG, WebP, SVG images here or browse
                                                </span>
                                                <span className="font-medium underline text-xs text-purple-500 hover:text-purple-400">
                                                    Browse File
                                                </span>
                                            </div>
                                        )}
                                    </CldUploadWidget>
                                </div>
                            </div>
                        </div>
                    </div>
                    {uploadedImage && (
                        <div className="mt-2">
                            <p className="text-xs text-green-400">Image uploaded successfully!</p>
                            <img
                                src={uploadedImage}
                                alt="Uploaded"
                                className="mt-2 w-32 h-32 object-cover rounded-lg border border-gray-700"
                            />
                        </div>
                    )}
                    {errors.image && <p className="text-red-400 text-xs">{errors.image.message}</p>}
                    {imageError && <p className="text-red-400 text-xs">{imageError}</p>}
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
                        {errors.participants && <p className="text-red-400 text-xs">{errors.participants.message}</p>}
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
                <motion.button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    disabled={uploading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Submit Proposal
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </form>
        </motion.div>
    );
}
