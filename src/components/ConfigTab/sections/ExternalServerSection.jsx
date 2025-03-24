import { useState, useEffect, useRef, useContext } from "preact/hooks";
import { AuthContext } from "../../../contexts/AuthContext";
import { MoveLeft } from "lucide-preact";
import { BASE_URL } from "../../../config";

const errorStyle =
  "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";
const baseStyle =
  "bg-gray-50 border border-gray-300 dark:border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500";

const fetchConfig = async (token) => {
  const res = await fetch(BASE_URL + "config?seccion=servidor", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
};

const saveConfig = async (data, token) => {
  if (!token) return;
  let formData = new FormData();
  Object.keys(data).forEach((k) => {
    formData.append(k, data[k]);
  });
  formData.append("seccion", "servidor");
  console.log(formData);

  return await fetch(BASE_URL + "config", {
    method: "POST",
    body: new URLSearchParams(formData),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default function ExternalServerSection() {
  const [formData, setFormData] = useState({ url: "", puerto: "" });
  const [errors, setErrors] = useState({ url: false, puerto: false });
  const [message, setMessage] = useState({ text: "", type: "" });
  const { token, setToken } = useContext(AuthContext);
  const timeoutRef = useRef(null);

  const { url, puerto } = formData;

  useEffect(async () => {
    try {
      setFormData(await fetchConfig(token));
    } catch (error) {
      console.log("Error al cargar configuración");
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let validation = {
      url: false,
      puerto: false,
    };

    if (url === "") validation = { ...validation, url: true };
    if (puerto === "") validation = { ...validation, puerto: true };

    if (!(validation.url || validation.puerto)) {
      setErrors({
        url: false,
        puerto: false,
      });
      let res = await saveConfig(formData, token);
      if (res.status === 200) {
        setMessage({
          text: "Cambios guardados exitosamente.",
          type: "success",
        });
      } else if (res.status === 401) {
        if (timeoutRef.current === null) {
          timeoutRef.current = setTimeout(() => {
            setMessage({ text: "", type: "" });
            setToken(null);
            location.route("/config");
          }, 2000);
        } else {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setMessage({ text: "", type: "" });
            setToken(null);
            location.route("/config");
          }, 2000);
        }
      } else {
        setMessage({
          text: "Error al guardar los cambios. Inténtelo de nuevo.",
          type: "error",
        });
      }
      return 0;
    }
    setErrors(validation);
  };

  return (
    <div className="max-w-lg mx-auto rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start">
          <a
            className="text-gray-600 dark:text-gray-600 mr-5 p-2 rounded-full hover:bg-slate-200 transition-colors"
            href="/configuracion"
          >
            <MoveLeft />
          </a>
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
              type="number"
              id="puerto"
              class={`${errors.puerto ? errorStyle : baseStyle} w-full md:w-24`}
              required
              name="puerto"
              onInput={updateForm}
              value={puerto}
            />
            {errors.port && (
              <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">Ingrese un valor válido.</span>
              </p>
            )}
          </div>
        </div>
        {message.text && (
          <p
            className={`text-sm text-center mb-4 ${
              message.type === "success"
                ? "text-green-600 dark:text-green-500"
                : "text-red-600 dark:text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}
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
