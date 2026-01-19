import React from "react";

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors z-10"
        >
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
              VinFast Dashboard
            </h2>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
              Open Source by{" "}
              <span className="text-blue-600 dark:text-blue-400">VF9 Club Vietnam</span>
            </p>
          </div>

          {/* Mobile Content (Short, No Images) */}
          <div className="md:hidden space-y-4">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              A community hobby project developed to provide deeper insights
              into your vehicle&apos;s data. We visualize raw telemetry from
              VinFast servers to show details often missing from the official
              app.
            </p>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 space-y-2 border border-gray-100 dark:border-gray-600">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Main Goals</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc pl-4">
                <li>Visualize hidden data (SOH, ECU versions)</li>
                <li>Clear, intuitive status monitoring</li>
                <li>Community-drived & Non-commercial</li>
              </ul>
            </div>

            <div className="text-xs text-gray-400 dark:text-gray-500 text-center pt-4 border-t border-gray-100 dark:border-gray-700 italic">
              <div className="flex justify-center items-center gap-2 mb-2">
                <span>v1.0.0</span>
                <span>•</span>
                <a
                  href="https://github.com/VF9-Club/VFDashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1"
                >
                  GitHub
                </a>
              </div>
              &quot;A tool for enthusiasts, by enthusiasts.&quot; <br />
              Not affiliated with VinFast Auto.
            </div>
          </div>

          {/* Desktop Content (Full, With Images) */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div className="prose prose-blue prose-sm dark:prose-invert">
                  <p className="text-gray-600 dark:text-gray-300 leading-snug">
                    <strong>VinFast Dashboard</strong> is an open-source project
                    initiated by members of <strong>VF9 Club Vietnam</strong>.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-snug">
                    Our mission is to build a comprehensive tool that helps
                    users visualize vehicle data more intuitively. By leveraging
                    raw telemetry, we surface valuable insights—such as
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {" "}
                      Battery SOH
                    </span>{" "}
                    and{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      ECU Versions
                    </span>
                    —often not visible in the official app.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-snug">
                    This is strictly a{" "}
                    <strong>non-commercial, hobbyist initiative</strong> created
                    purely out of passion for technology and the VinFast
                    community.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50">
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1 text-sm">
                      Deeper Insights
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      See what&apos;s under the hood with raw visualization.
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800/50">
                    <h4 className="font-bold text-green-800 dark:text-green-300 mb-1 text-sm">
                      Real-time Data
                    </h4>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Live updates for battery, charging, and climate status.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <div className="rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 relative group max-w-[220px]">
                  <img
                    src="/mobile-vf9-energy.webp"
                    alt="Dashboard Preview"
                    className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                    <span className="text-white font-bold text-xs">
                      Visualizing Hidden Data
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
              <div className="flex justify-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-2">
                <span>v1.0.0 (Stable)</span>
                <span>•</span>
                <a
                  href="https://github.com/VF9-Club/VFDashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 font-medium transition-colors"
                >
                  View Source on GitHub
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Made with ❤️ in Vietnam
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xl mx-auto leading-normal">
                Disclaimer: This software is not affiliated with, endorsed by,
                or connected to VinFast Auto or its subsidiaries. It is provided
                &quot;as is&quot; for educational and personal use only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
