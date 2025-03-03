import { useState, useEffect } from "preact/hooks";
import { MoveLeft } from "lucide-preact";
import AlarmCard from "./AlarmCard";
import CreateAlarm from "./CreateAlarm";
import { BASE_URL } from "../../../../config";

//const variables = ["Temperatura", "Humedad", "Presión"];
const variables = [
  "temperatura",
  "presion",
  "humedad",
  "velocidad",
  "pluviosidad",
  "direccion",
];

const fetchConfig = async () => {
  const res = await fetch(BASE_URL + "config?seccion=alarmas");
  return await res.json();
};

const saveConfig = async (data) => {
  console.log(data);
  let formData = new FormData();
  Object.keys(data).forEach((k) => {
    formData.append(`${k}_bajo`, data[k].bajo);
    formData.append(`${k}_alto`, data[k].alto);
  });
  formData.append("seccion", "alarmas");
  console.log(formData);

  return await fetch(BASE_URL + "config", {
    method: "POST",
    body: new URLSearchParams(formData),
  });
};

export default function AlarmsSection({ backFn }) {
  const [alarms, setAlarms] = useState({});

  useEffect(async () => {
    try {
      setAlarms(await fetchConfig());
    } catch (error) {
      console.log("Error al cargar configuración");
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    let res = await saveConfig(alarms);
    console.log(res);
    return 0;
  };

  const updateAlarm = (variable, thresholds) => {
    setAlarms({ ...alarms, [variable]: thresholds });
  };

  const addAlarm = (alarm) => {
    const { variable, ...rest } = alarm;
    setAlarms({ ...alarms, [variable]: { ...rest } });
  };

  const deleteAlarm = (variable) => {
    const { [variable]: _, ...variables } = alarms;
    setAlarms({ ...variables });
  };

  const filteredVariables = variables.filter(
    (variable) => !Object.keys(alarms).includes(variable)
  );

  return (
    <div className="max-w-lg mx-auto rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
      <div className="flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start">
            <button
              className="text-gray-600 dark:text-gray-600 mr-5 p-2 rounded-full hover:bg-slate-200 transition-colors"
              onClick={backFn}
            >
              <MoveLeft />
            </button>
            <div className="flex flex-col">
              <h2 class="text-3xl font-bold dark:text-white mb-2">Alarmas</h2>
              <p class="text-md font-normal text-gray-500 lg:text-lg dark:text-gray-400">
                Crea y modifica alarmas
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <CreateAlarm variables={filteredVariables} addAlarm={addAlarm} />
          <div className="flex flex-col gap-y-3 py-4">
            <h3 className="text-lg mb-4 font-semibold text-gray-400 dark:text-gray-300">
              Alarmas existentes
            </h3>
            {Object.keys(alarms).map((alarm) => (
              <AlarmCard
                alarm={{ variable: alarm, ...alarms[alarm] }}
                updateAlarm={updateAlarm}
                deleteAlarm={deleteAlarm}
              />
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={onSubmit}
              class="font-semibold focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
