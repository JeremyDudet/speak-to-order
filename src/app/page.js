"use client";

import dynamic from "next/dynamic";
import { Transition } from "@headlessui/react";

const STTComponent = dynamic(() => import("./STTComponent"), {
  ssr: false, // This line is important. It disables server-side rendering for this component.
});

export default function Home() {
  // Check if the browser is not Chrome
  const isNotChrome = !window.navigator.userAgent.includes("Chrome");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative bg-gray-100 dark:bg-gray-900">
      {isNotChrome && (
        <Transition
          show={isNotChrome}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden absolute top-0 left-1/2 transform -translate-x-1/2 mt-4">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {/* Icon */}
                  <svg
                    className="h-6 w-6 text-red-400 dark:text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    Warning
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    This app works best on Chrome.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      )}
      <STTComponent />
      {/* rest of your component */}
    </main>
  );
}
