import { useState } from "preact/hooks";
import { MoveLeft } from "lucide-preact";

const errorStyle =
  "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";
const baseStyle =
  "bg-gray-50 border border-gray-300 dark:border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500";

export default function ExternalServerSection({ backFn }) {
  const [formData, setFormData] = useState({ url: "", port: "" });
  const [errors, setErrors] = useState({ url: false, port: false });
  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("asd");
  };
  const { url, port } = formData;
  return (
    <div className="max-w-lg mx-auto rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start">
          <button
            className="text-gray-600 dark:text-gray-600 mr-5 p-2 rounded-full hover:bg-slate-200 transition-colors"
            onClick={backFn}
          >
            <MoveLeft />
          </button>
          <div className="flex flex-col">
            <h2 class="text-3xl font-bold dark:text-white mb-2">
              Servidor externo
            </h2>
            <p class="text-md font-normal text-gray-500 lg:text-lg dark:text-gray-400">
              Conexión al servidor externo
            </p>
          </div>
        </div>
      </div>
      <form onSubmit={onSubmit} className="p-6">
        <div className="flex flex-col md:flex-row gap-0 md:gap-6 mb-5">
          <div class="flex-1">
            <label
              for="url"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              URL
            </label>
            <input
              type="text"
              id="url"
              class={errors.url ? errorStyle : baseStyle}
              required
              name="url"
              onInput={updateForm}
              value={url}
            />
            {errors.url && (
              <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">Ingrese un valor válido.</span>
              </p>
            )}
          </div>
          <div class="">
            <label
              for="url"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Puerto
            </label>
            <input
              type="text"
              id="port"
              class={`${errors.port ? errorStyle : baseStyle} w-full md:w-24`}
              required
              name="port"
              onInput={updateForm}
              value={port}
            />
            {errors.port && (
              <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">Ingrese un valor válido.</span>
              </p>
            )}
          </div>
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
