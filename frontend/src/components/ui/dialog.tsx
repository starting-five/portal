import * as React from "react";
import {
  Root as Dialog,
  Trigger as DialogTrigger,
  Content as DialogContent,
  Title as DialogTitle,
  Description as DialogDescription,
  Close as DialogClose,
} from "@radix-ui/react-dialog";

// Custom DialogHeader component
export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose };
