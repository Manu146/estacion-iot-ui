import { useState } from "preact/hooks";

const errorStyle =
  "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";
const baseStyle =
  "bg-gray-50 border border-gray-300 dark:border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500";

const variablesNombres = {
  humedad: "Humedad",
  temperatura: "Temperatura",
  presion: "Presión",
  velocidad: "Velocidad del viento",
  pluviosidad: "Pluviosidad",
  direccion: "Dirección del viento",
};

export default function CreateAlarm({ variables, addAlarm }) {
  const [formState, setformState] = useState({
    bajo: "",
    alto: "",
    variable: "",
  });
  const [error, setError] = useState({
    alto: false,
    bajo: false,
    variable: false,
  });
  return (
    <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pt-4 pb-6">
      <h3 className="text-lg mb-4 font-semibold text-gray-400 dark:text-gray-300">
        Crear alarma
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            for="countries"
            class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Variable
          </label>
          <select
            value={formState.variable}
            onChange={(e) =>
              setformState({ ...formState, variable: e.target.value })
            }
            id="countries"
            class={`bg-gray-50 border ${
              error.variable
                ? "text-red-500 border-red-500 dark:border-red-500 dark:text-red-500"
                : "text-gray-900 border-gray-300 dark:border-gray-600 dark:text-white"
            }  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          >
            <option value="" selected>
              Seleciona una variable
            </option>
            {variables.map((variable) => (
              <option value={variable}>{variablesNombres[variable]}</option>
            ))}
          </select>
        </div>
        <div>
          <label
            for="low-new"
            class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Limite inferior
          </label>
          <input
            value={formState.bajo}
            onChange={(e) =>
              setformState({ ...formState, bajo: e.target.value })
            }
            type="number"
            id="low-new"
            class={error.bajo ? errorStyle : baseStyle}
            placeholder="Ingrese valor"
            required
            step="any"
          />
        </div>
        <div>
          <label
            for="high-new"
            class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Limite superior
          </label>
          <input
            value={formState.alto}
            onChange={(e) =>
              setformState({ ...formState, alto: e.target.value })
            }
            type="number"
            id="high-new"
            class={error.alto ? errorStyle : baseStyle}
            placeholder="Ingrese valor"
            required
            step="any"
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={() => {
            const { alto, bajo, variable } = formState;
            let errorL = bajo === "" || bajo >= alto;
            let errorH = alto === "" || alto <= bajo;
            let errorV = variable === "";
            if (!errorL && !errorH) {
              console.log(formState);
              addAlarm(formState);
              setformState({ bajo: "", alto: "", variable: "" });
            }
            setError({ alto: errorH, bajo: errorL, variable: errorV });
          }}
          type="button"
          class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Crear alarma
        </button>
      </div>
    </div>
  );
}
