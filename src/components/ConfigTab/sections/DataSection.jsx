import { useState, useEffect, useRef, useContext } from "preact/hooks";
import { AuthContext } from "../../../contexts/AuthContext";
import { MoveLeft } from "lucide-preact";
import { BASE_URL } from "../../../config";

const intervalTimes = [2, 5, 10, 15, 30, 60];

const timeZones = [
  ["GMT -3:00 Brasilia", -10800],
  ["GMT -4:00 - Caracas", -14400],
  ["GMT -5:00 - Bogotá", -18000],
];

const baseStyle =
  "bg-gray-50 border border-gray-300 dark:border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500";

const fetchConfig = async (token) => {
  const res = await fetch(BASE_URL + "config?seccion=datos", {
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
  formData.append("seccion", "datos");

  return await fetch(BASE_URL + "config", {
    method: "POST",
    body: new URLSearchParams(formData),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default function DataSection() {
  const [formData, setFormData] = useState({
    p_muestreo: "5",
    z_horaria: "-14400",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const timeoutRef = useRef(null);
  const { token, setToken } = useContext(AuthContext);

  const { p_muestreo, z_horaria } = formData;

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
    let res = await saveConfig(formData, token);
    if (res.status === 200) {
      setMessage({ text: "Cambios guardados exitosamente.", type: "success" });
    } else if (res.status === 401) {
      setMessage({
        text: "La sesión ha expirado. Por favor, inicie sesión nuevamente.",
        type: "error",
      });
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
  };

  return (
    <div className="max-w-lg mx-auto rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700 p-6">
        <a
          href="/config"
          className="text-gray-600 dark:text-gray-600 mr-5 p-2 rounded-full hover:bg-slate-200 transition-colors"
        >
          <MoveLeft />
        </a>
        <h2 class="text-3xl font-bold dark:text-white mb-2">Toma de datos</h2>
      </div>
      <form
        class="p-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
      >
        <div className="mb-5">
          <label
            for="p_muestreo"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Período de muestreo
          </label>
          <select
            id="p_muestreo"
            value={p_muestreo}
            name="p_muestreo"
            onChange={updateForm}
            class={baseStyle}
          >
            {intervalTimes.map((t) => (
              <option key={t} value={t.toString()}>{`${t} minutos`}</option>
            ))}
          </select>
        </div>
        <div className="mb-5">
          <label
            for="z_horaria"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Zona horaria
          </label>
          <select
            id="z_horaria"
            value={z_horaria}
            name="z_horaria"
            onChange={updateForm}
            class={baseStyle}
          >
            {timeZones.map((t, i) => (
              <option key={i} value={t[1]}>
                {t[0]}
              </option>
            ))}
          </select>
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
