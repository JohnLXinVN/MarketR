"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({
    title: "Confirm",
    message: "Are you sure?",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const confirm = useCallback(({ title, message }) => {
    return new Promise((resolve) => {
      setOptions({
        title,
        message,
        onConfirm: () => {
          resolve(true);
          setIsOpen(false);
        },
        onCancel: () => {
          resolve(false);
          setIsOpen(false);
        },
      });
      setIsOpen(true);
    });
  }, []);

  const ConfirmDialog = () =>
    isOpen
      ? createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#0f223a] rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-2 text-white">
                {options.title}
              </h2>
              <p className="text-gray-300 mb-4">{options.message}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={options.onCancel}
                  className="px-4 py-2 cursor-pointer rounded bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={options.onConfirm}
                  className="px-4 py-2 rounded cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return { confirm, ConfirmDialog };
}
