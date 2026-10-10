
"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "12px",
          background: "#203e2b",
          color: "#ffffff",
          padding: "14px 18px",
        },
        success: {
          iconTheme: {
            primary: "#86efac",
            secondary: "#203e2b",
          },
        },
      }}
    />
  );
}
