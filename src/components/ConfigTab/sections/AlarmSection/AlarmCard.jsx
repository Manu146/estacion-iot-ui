import { useState } from "preact/hooks";
import { Trash2, Pencil } from "lucide-preact";

const variablesNombres = {
  humedad: "Humedad",
  temperatura: "Temperatura",
  presion: "Presión",
  velocidad: "Velocidad del viento",
  pluviosidad: "Pluviosidad",
  solar: "Potencia panel solar",
};

export default function AlarmCard({ alarm, updateAlarm, deleteAlarm }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tresholds, setTresholds] = useState({
    bajo: alarm.bajo,
    alto: alarm.alto,
  });

  const { variable, bajo, alto } = alarm;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <span className="font-semibold dark:text-white text-gray-900">
          {variablesNombres[variable]}
        </span>
        <div>
          {isEditing ? (
            <>
              <input
                value={tresholds.bajo}
                onChange={(e) =>
                  setTresholds({ ...tresholds, bajo: e.target.value })
                }
                type="number"
                id="low"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Bajo"
                required
              />
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground text-gray-500 dark:text-gray-400 ">
                Bajo:{" "}
              </span>
              <span className="font-medium text-gray-400 dark:text-gray-300">
                {bajo}
              </span>
            </>
          )}
        </div>
        <div>
          {isEditing ? (
            <>
              <input
                value={tresholds.alto}
                onChange={(e) =>
                  setTresholds({ ...tresholds, alto: e.target.value })
                }
                type="number"
                id="high"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Alto"
                required
              />
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground text-gray-500 dark:text-gray-400 ">
                Alto:{" "}
              </span>
              <span className="font-medium text-gray-400 dark:text-gray-300">
                {alto}
              </span>
            </>
          )}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  updateAlarm(variable, tresholds);
                  setIsEditing(false);
                }}
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-900 h-10 w-10"
              >
                <Pencil />
              </button>
              <button
                onClick={() => deleteAlarm(variable)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0  bg-red-500 text-white hover:bg-red-400 h-10 w-10"
              >
                <Trash2 />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
