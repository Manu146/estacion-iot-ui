import { useState, useEffect } from "preact/hooks";
import { MoveLeft } from "lucide-preact";
import { BASE_URL } from "../../config";

const errorStyle =
  "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";
const baseStyle =
  "bg-gray-50 border border-gray-300 dark:border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500";

const fetchConfig = async () => {
  const res = await fetch(BASE_URL + "config?seccion=calibracion");
  return await res.json();
};

const saveConfig = async (data) => {
  console.log(data);
  let formData = new FormData();
  Object.keys(data).forEach((k) => {
    formData.append(k, data[k]);
  });
  formData.append("seccion", "calibracion");
  console.log(formData);

  return await fetch(BASE_URL + "config", {
    method: "POST",
    body: new URLSearchParams(formData),
  });
};

export default function CalibrationSection({ backFn }) {
  const [formData, setFormData] = useState({
    solar: "",
    anemometro: "",
    pluviometro: "",
  });
  const [errors, setErrors] = useState({ solar: false });

  const { solar, anemometro, pluviometro } = formData;

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

  const onSubmit = async (e) => {
    e.preventDefault();
    let validation = {
      solar: false,
      anemometro: false,
      pluviometro: false,
    };
    if (solar === "") validation = { ...validation, solar: true };
    if (anemometro === "") validation = { ...validation, anemometro: true };
    if (pluviometro === "") validation = { ...validation, pluviometro: true };

    if (
      !(validation.solar || validation.anemometro || validation.pluviometro)
    ) {
      setErrors({
        solar: false,
        anemometro: false,
        pluviometro: false,
      });
      let res = await saveConfig(formData);
      console.log(res);
      return 0;
    }
    setErrors(validation);
  };

  return (
    <div className="max-w-lg mx-auto rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
      <div className="flex p-6 border-b border-gray-200 dark:border-gray-700">
        <button
          className="text-gray-600 dark:text-gray-600 mr-5 p-2 rounded-full hover:bg-slate-200 transition-colors"
          onClick={backFn}
        >
          <MoveLeft />
        </button>
        <h2 className="text-3xl font-bold dark:text-white mb-2">Calibración</h2>
      </div>
      <form onSubmit={onSubmit} className="p-6">
        <div class="mb-5">
          <label
            for="solar"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Radiación solar??
          </label>
          <input
            type="number"
            id="solar"
            class={errors.solar ? errorStyle : baseStyle}
            required
            name="solar"
            onInput={updateForm}
            value={solar}
          />
          {errors.solar && (
            <p class="mt-2 text-sm text-red-600 dark:text-red-500">
              <span class="font-medium">Ingrese un valor válido.</span>
            </p>
          )}
        </div>
        <div class="mb-5">
          <label
            for="anemometro"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Anemómetro
          </label>
          <input
            type="number"
            id="anemometro"
            class={errors.anemometro ? errorStyle : baseStyle}
            required
            name="anemometro"
            onInput={updateForm}
            value={anemometro}
          />
          {errors.anemometro && (
            <p class="mt-2 text-sm text-red-600 dark:text-red-500">
              <span class="font-medium">Ingrese un valor válido.</span>
            </p>
          )}
        </div>
        <div class="mb-5">
          <label
            for="pluviometro"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Pluviómetro
          </label>
          <input
            type="number"
            id="pluviometro"
            class={errors.pluviometro ? errorStyle : baseStyle}
            required
            name="pluviometro"
            onInput={updateForm}
            value={pluviometro}
          />
          {errors.pluviometro && (
            <p class="mt-2 text-sm text-red-600 dark:text-red-500">
              <span class="font-medium">Ingrese un valor válido.</span>
            </p>
          )}
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
