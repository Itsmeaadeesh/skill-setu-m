import React from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = usePlatform();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-lg shadow-xl border flex items-start space-x-3 transition-all transform animate-in slide-in-from-bottom-2 ${
              isSuccess
                ? "bg-[#07265D] text-white border-amber-400"
                : isWarning
                ? "bg-amber-900 text-white border-amber-500"
                : "bg-gray-900 text-white border-blue-400"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-300" />}
              {!isSuccess && !isWarning && <Info className="w-5 h-5 text-blue-300" />}
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-sm text-white">{toast.title}</div>
              <div className="text-gray-300 mt-0.5 leading-snug">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white flex-shrink-0 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
