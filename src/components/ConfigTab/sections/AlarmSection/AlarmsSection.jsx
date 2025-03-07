import { useState, useEffect, useRef } from "preact/hooks";
import { MoveLeft } from "lucide-preact";
import AlarmCard from "./AlarmCard";
import CreateAlarm from "./CreateAlarm";
import { BASE_URL } from "../../../../config";

const variables = [
  "temperatura",
  "presion",
  "humedad",
  "velocidad",
  "pluviosidad",
  "direccion",
];

const fetchConfig = async (token) => {
  const res = await fetch(BASE_URL + "config?seccion=alarmas", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
};

const saveConfig = async (data, token) => {
  if (!token) return;
  let formData = new FormData();
  data.forEach((k) => {
    formData.append(`${k.variable}_bajo`, k.bajo);
    formData.append(`${k.variable}_alto`, k.alto);
  });
  formData.append("seccion", "alarmas");
  console.log(formData);

  return await fetch(BASE_URL + "config", {
    method: "POST",
    body: new URLSearchParams(formData),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default function AlarmsSection({ backFn, returnToLogin, token }) {
  const [alarms, setAlarms] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const timeoutRef = useRef(null);

  useEffect(async () => {
    try {
      setAlarms(await fetchConfig(token));
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

  const onSubmit = async (e) => {
    e.preventDefault();
    let res = await saveConfig(alarms, token);
    if (res.status === 200) {
      setMessage({ text: "Cambios guardados exitosamente.", type: "success" });
    } else if (res.status === 401) {
      setMessage({
        text: "La sesión ha expirado. Por favor, inicie sesión nuevamente.",
        type: "error",
      });
      timeoutRef.current = setTimeout(() => {
        returnToLogin();
      }, 2000);
    } else {
      setMessage({
        text: "Error al guardar los cambios. Inténtelo de nuevo.",
        type: "error",
      });
    }
  };

  const updateAlarm = (variable, thresholds) => {
    //const index = alarms.indexOf()
    //setAlarms({ ...alarms, [variable]: thresholds });
    setAlarms((prev) =>
      prev.map((a) => (a.variable === variable ? { ...a, ...thresholds } : a))
    );
  };

  const addAlarm = (alarm) => {
    //const { variable, ...rest } = alarm;
    //setAlarms({ ...alarms, [variable]: { ...rest } });
    setAlarms((prev) => [...prev, alarm]);
  };

  const deleteAlarm = (variable) => {
    //const { [variable]: _, ...variables } = alarms;
    //setAlarms({ ...variables });
    setAlarms((prev) => prev.filter((a) => a.variable !== variable));
  };

  /*const filteredVariables = variables.filter(
    (variable) => !Object.keys(alarms).includes(variable)
  );*/

  const filteredVariables = variables.filter(
    (v) => !alarms.map((a) => a.variable).includes(v)
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
                key={alarm}
                alarm={{ variable: alarm, ...alarms[alarm] }}
                updateAlarm={updateAlarm}
                deleteAlarm={deleteAlarm}
              />
            ))}
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
        </div>
      </div>
    </div>
  );
}
