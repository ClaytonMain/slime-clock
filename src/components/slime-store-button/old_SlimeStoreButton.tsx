import { type ReactNode } from "react";

/**
 * Doesn't actually do anything with the Slime Store by default,
 * but all the other components did, so...
 */
export default function SlimeStoreButton({
  onClick,
  label,
  buttonContents,
}: {
  onClick: () => void;
  label?: string;
  buttonContents?: string | ReactNode;
}) {
  const buttonId = label
    ? `${label.toLowerCase().replace(" ", "-")}-button`
    : typeof buttonContents === "string"
      ? buttonContents.toLowerCase().replace(" ", "-")
      : undefined;

  return (
    <div className="mb-1 flex flex-col rounded-lg bg-red-300 p-2">
      {label && (
        <label
          htmlFor={buttonId}
          className="mb-1 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
      )}
      <div className="flex h-44 w-full flex-col items-center">
        <button
          onClick={onClick}
          id={buttonId}
          type="button"
          className="me-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
        >
          {buttonContents}
        </button>
      </div>
    </div>
  );
}
