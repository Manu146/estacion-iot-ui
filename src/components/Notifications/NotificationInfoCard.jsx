//import React from 'react'
import { X, Info } from "lucide-preact";

export default function AlarmCriticalCard({ notification, dismissFn }) {
  return (
    <div className="w-full flex gap-2 items-start rounded-lg border border-blue-600 text-blue-600 p-4 mt-4">
      <div className="mt-1">
        <Info size={20} />
      </div>
      <div className="flex flex-col gap-2">
        <h5 className="font-semibold text-blue-600 text-base">
          Alarma de velocidad de viento alta
        </h5>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-400">
          Velocidad detectada: 60 m/s
        </p>
        <span className="text-sm text-gray-500 dark:text-gray-500">
          5:45:23 PM
        </span>
      </div>
      <div className="flex flex-1 justify-end text-gray-600 dark:text-gray-400 mt-1">
        <button onClick={dismissFn}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
