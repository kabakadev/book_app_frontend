import * as React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}
