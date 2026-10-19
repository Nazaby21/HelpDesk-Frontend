"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

interface ActionMenuProps {
  button: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
}

export function ActionMenu({ button, children }: ActionMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        {button}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={4}
          collisionPadding={10}
          className="z-[9999] w-48 animate-in fade-in zoom-in-95 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700"
        >
          {children(() => setOpen(false))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
