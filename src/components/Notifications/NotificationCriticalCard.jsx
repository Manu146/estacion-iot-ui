//import React from 'react'
import { CircleX, X } from "lucide-preact";

const variablesText = {
  temperatura: { text: "temperatura", unit: "°C" },
  humedad: { text: "humedad", unit: "%" },
  solar: { text: "radiación solar", unit: "W/m2" },
  presion: { text: "presión", unit: "atm" },
  velocidad: { text: "velocidad de viento", unit: "m/s" },
  pluviosidad: { text: "pluviosidad", unit: "mm" },
  direccion: { text: "variable", unit: "°" },
};

export default function AlarmCriticalCard({ notification, dismissFn }) {
  return (
    <div className="w-full flex gap-2 items-start rounded-lg border border-red-600 text-red-600 p-4 mt-4">
      <div className="mt-1">
        <CircleX size={20} />
      </div>
      <div className="flex flex-col gap-1">
        <h5 className="font-semibold text-red-600 text-base">
          Alarma de
          {` ${variablesText[notification.variable].text || "variable"} ${
            notification.eventType
          }`}
        </h5>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-400">
          {`Valor detectado: ${notification.valor.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: false,
          })} ${variablesText[notification.variable].unit}`}
        </p>
        <span className="text-sm text-gray-500 dark:text-gray-500">
          {new Date(notification.t).toLocaleTimeString()}
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
