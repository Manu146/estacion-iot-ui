import { useState, useRef, useEffect } from "preact/hooks";
import { MoveLeft } from "lucide-preact";
import { BASE_URL } from "../../../config";

const saveConfig = async (token) => {
  if (!token) return;
  let formData = new FormData();
  formData.append("seccion", "reset");

  return await fetch(BASE_URL + "config", {
    method: "POST",
    body: new URLSearchParams(formData),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default function ResetSection({ backFn, token }) {
  const [message, setMessage] = useState({ text: "", type: "" });
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    const response = await saveConfig(token);
    if (response.status === 200) {
      setMessage({
        text: "El dispositivo se está restableciendo",
        type: "success",
      });
      timeoutRef.current = setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      setMessage({
        text: "Error al restablecer el dispositivo. Inténtelo de nuevo.",
        type: "error",
      });
    }
  };

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
      <div className="flex flex-col justify-center p-6">
        <button
          onClick={handleReset}
          type="button"
          class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Restablecer
        </button>
        {message.text && (
          <div className="flex justify-center p-6">
            <p
              className={`text-sm text-center ${
                message.type === "success"
                  ? "text-green-600 dark:text-green-500"
                  : "text-red-600 dark:text-red-500"
              }`}
            >
              {message.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
