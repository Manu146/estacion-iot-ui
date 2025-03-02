import { useState } from "preact/hooks";
import { MoveLeft } from "lucide-preact";

const intervalTimes = [2, 5, 10, 15, 30, 60];

const baseStyle =
  "bg-gray-50 border border-gray-300 dark:border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500";

const BASE_API_URL = "http://localhost:3000/";

const fetchConfig = async () => {
  const res = await fetch(BASE_API_URL + "config");
  return await res.json();
};

const saveConfig = (data) => {
  console.log(data);
};

export default function DataSection({ backFn }) {
  const [formData, setFormData] = useState({
    interval: "5",
  });

  const { interval } = formData;

  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = () => {
    saveConfig(formData);
  };

  return (
    <div className="max-w-lg mx-auto rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700 p-6">
        <button
          onClick={backFn}
          className="text-gray-600 dark:text-gray-600 mr-5 p-2 rounded-full hover:bg-slate-200 transition-colors"
        >
          <MoveLeft />
        </button>
        <h2 class="text-3xl font-bold dark:text-white mb-2">Toma de datos</h2>
      </div>
      <form
        class="p-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="mb-5">
          <label
            for="interval"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Frecuencia de muestreo
          </label>
          <select
            id="interval"
            value={interval}
            name="interval"
            onChange={updateForm}
            class={baseStyle}
          >
            {intervalTimes.map((t) => (
              <option key={t} value={t.toString()}>{`${t} minutos`}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onSubmit}
            class="font-semibold focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
