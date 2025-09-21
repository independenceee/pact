"use client";

import { createContext } from "react";

export type ModalContextType = {
    open: boolean;
    openModal: () => void;
    closeModal: () => void;
};

export const ModalContext = createContext<ModalContextType>({
    open: false,
    openModal: () => {},
    closeModal: () => {},
});
