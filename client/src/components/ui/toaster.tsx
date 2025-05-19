import * as React from "react";
import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col items-end p-4 space-y-4 pointer-events-none">
      {toasts.map(({ id, title, description, variant = "default" }) => (
        <div
          key={id}
          className={`${
            variant === "destructive"
              ? "bg-red-500"
              : variant === "success"
              ? "bg-green-500"
              : "bg-gray-800"
          } rounded-md p-4 text-white shadow-lg animate-in slide-in-from-right-10 duration-300 pointer-events-auto max-w-md`}
        >
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
      ))}
    </div>
  );
}