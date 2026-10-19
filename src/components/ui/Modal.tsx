"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  description,
  maxWidth = "lg",
}: ModalProps) {
  const maxWidthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
    "5xl": "sm:max-w-5xl",
    full: "sm:max-w-full sm:m-4",
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 transition-opacity animate-in fade-in" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 overflow-y-auto">
          <DialogPrimitive.Content
            className={cn(
              "relative w-full rounded-xl bg-white shadow-lg transition-all animate-in zoom-in-95 duration-200 sm:my-8",
              maxWidthClasses[maxWidth]
            )}
          >
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <DialogPrimitive.Title className="text-xl font-bold text-gray-900">
                  {title}
                </DialogPrimitive.Title>
                {description && (
                  <DialogPrimitive.Description className="mt-1 text-sm text-gray-500">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
              <DialogPrimitive.Close asChild>
                <button
                  aria-label="Close modal"
                  className="ml-4 inline-flex items-center justify-center rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/5"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </DialogPrimitive.Close>
            </div>
            <div className="px-6 py-5">
              {children}
            </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
