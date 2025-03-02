import { useState, useEffect } from "preact/hooks";
import { MoveLeft } from "lucide-preact";

const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;

const errorStyle =
  "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";
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

export default function WifiSection({ backFn }) {
  const [formData, setFormData] = useState({
    mode: "1",
    ssid: "",
    pass: "",
    ip: "",
    gateway: "",
  });
  const [noPw, setnoPw] = useState(false);
  const [errors, setErrors] = useState({
    ssid: false,
    pass: false,
    ip: false,
    gateway: false,
  });

  const { ssid, pass, ip, gateway, mode } = formData;

  useEffect(async () => {
    try {
      setFormData(await fetchConfig());
    } catch (error) {
      console.log("Error al cargar configuración");
    }
  }, []);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let validation = {
      ssid: false,
      pass: false,
      ip: false,
      gateway: false,
    };

    if (ssid === "") validation = { ...validation, ssid: true };
    if (pass === "" && !noPw) validation = { ...validation, pass: true };
    if (mode === "1") {
      if (ip === "" || !ipRegex.test(ip))
        validation = { ...validation, ip: true };
      if (gateway === "" || !ipRegex.test(gateway))
        validation = { ...validation, gateway: true };
    }

    if (
      !(
        validation.ssid ||
        validation.pass ||
        validation.ip ||
        validation.gateway
      )
    ) {
      saveConfig(formData);
      return 0;
    }
    setErrors(validation);
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
        <h2 class="text-3xl font-bold dark:text-white mb-2">Red</h2>
      </div>
      <form class="p-6" onSubmit={onSubmit}>
        <div className="mb-5">
          <label
            for="mode"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Seleccione modo de trabajo
          </label>
          <select
            id="mode"
            value={mode}
            name="mode"
            onChange={updateForm}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="1">Modo estación</option>
            <option value="2">Punto de acceso</option>
          </select>
        </div>
        <div class="mb-5">
          <label
            for="ssid"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nombre de la red
          </label>
          <input
            type="text"
            id="ssid"
            class={errors.ssid ? errorStyle : baseStyle}
            required
            name="ssid"
            onInput={updateForm}
            value={ssid}
          />
          {errors.ssid && (
            <p class="mt-2 text-sm text-red-600 dark:text-red-500">
              <span class="font-medium">Ingrese un valor válido.</span>
            </p>
          )}
        </div>
        <div class="mb-5 flex items-center gap-5">
          <div className="flex flex-col flex-1">
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Contraseña
            </label>
            <input
              disabled={noPw}
              type="password"
              id="password"
              class={`disabled:cursor-not-allowed bg-gray-50 border  dark:disabled:bg-gray-800 dark:disabled:border-gray-700 dark:disable:placeholder-gray-500${
                errors.pass ? errorStyle : baseStyle
              }  `}
              name="pass"
              onInput={updateForm}
              value={pass}
            />
            {errors.pass && (
              <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">Ingrese un valor válido.</span>
              </p>
            )}
          </div>
          <label class="flex cursor-pointer pt-5">
            <input
              type="checkbox"
              value=""
              class="sr-only peer"
              onInput={() => {
                setnoPw((nopw) => !nopw);
                updateForm({ target: { name: "pass", value: "" } });
              }}
            />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Sin contraseña
            </span>
          </label>
        </div>
        {mode === "1" && (
          <>
            <div class="mb-5">
              <label
                for="ip"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Dirección IP
              </label>
              <input
                type="text"
                id="ip"
                class={errors.ip ? errorStyle : baseStyle}
                placeholder="192.168.0.100"
                required
                name="ip"
                onInput={updateForm}
                value={ip}
              />
              {errors.ip && (
                <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span class="font-medium">Ingrese un valor válido.</span>
                </p>
              )}
            </div>
            <div class="mb-5">
              <label
                for="gateway"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Puerta de enlace
              </label>
              <input
                type="text"
                id="gateway"
                class={errors.gateway ? errorStyle : baseStyle}
                placeholder="192.168.0.1"
                required
                name="gateway"
                onInput={updateForm}
                value={gateway}
              />
              {errors.gateway && (
                <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span class="font-medium">Ingrese un valor válido.</span>
                </p>
              )}
            </div>
          </>
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
