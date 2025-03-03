import { MoveLeft } from "lucide-preact";

export default function ResetSection({ backFn }) {
  return (
    <div className="max-w-lg mx-auto rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
      <div className="flex items-start border-b border-gray-200 dark:border-gray-700 p-6">
        <button
          className="text-gray-600 dark:text-gray-600 mr-5 p-2 rounded-full hover:bg-slate-200 transition-colors"
          onClick={backFn}
        >
          <MoveLeft />
        </button>
        <div className="flex flex-col">
          <h2 class="text-3xl font-bold dark:text-white mb-2">
            Restablecer dispositivo
          </h2>
          <p class="text-md font-normal text-gray-500 lg:text-lg dark:text-gray-400 mb-4">
            Restablecer el dispositivo. <br />
            Esto eliminara toda la configuración y datos existentes.
          </p>
        </div>
      </div>
      <div className="flex justify-center p-6">
        <button
          type="button"
          class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Restablecer
        </button>
      </div>
    </div>
  );
}
