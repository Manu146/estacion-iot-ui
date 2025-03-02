import { useState, useEffect } from "preact/hooks";
import { Settings, MoveLeft } from "lucide-preact";
import Modal from "react-modal";
import { useWebSocket, ReadyState } from "./hooks/useWs";
import Cards from "./components/cards/Cards";
import Chart from "./components/chart/Chart";
import ConfigTab from "./ConfigTab/ConfigTab";
import Notifiactions from "./components/Notifications/Notificacions";

Modal.setAppElement("#app");

const stringToday = new Date(Date.now()).toLocaleDateString("es-ES", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

//TODO Obtener configuracion, si falta algo, mostrar notificacion
//TODO Probar autenticacion con servidor de prueba

export function App() {
  const [view, setView] = useState("data"); //Data, Config
  const { readyState, lastMessage, send, status } = useWebSocket(
    "ws://localhost:3000/tiemporeal"
  ); //`ws://${window.location.host}/ws`);
  const [displayData, setDisplayData] = useState({});
  const [notifications, setNotifications] = useState({
    critical: [],
    info: [],
  });

  const backFn = () => setView("data");

  const dismissFn = (index) => {
    setNotifications((p) => ({
      ...p,
      critial: p["critical"].splice(index, 1),
    }));
  };

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      send("test message");
    }
  }, [readyState, send]); // make sure to include send in dependency array

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.tipo === "datos") setDisplayData(lastMessage.data);
      if (lastMessage.tipo === "alarma") {
        const newCritical = lastMessage.data;
        setNotifications((p) => ({
          ...p,
          critical: [newCritical, ...p["critical"]],
        }));
      }
    }
  }, [lastMessage]);

  const Icon = view === "data" ? Settings : MoveLeft;
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 class="mb-6 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          Estación meteorológica IoT UC
        </h1>
        <div className="h-10 items-center justify-center rounded-md bg-gray-100 text-gray-400 dark:bg-gray-700 p-1 dark:text-gray-400 grid w-full grid-cols-2">
          <button
            onClick={() => setView("data")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              view === "data"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50"
                : "bg-inherit text-inherit"
            }`}
          >
            Visualización
          </button>
          <button
            onClick={() => setView("config")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              view === "config"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50"
                : "bg-inherit text-inherit"
            }`}
          >
            Configuración
          </button>
        </div>
        {view === "data" && (
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm-items-center mt-4">
            <div className="">
              <h2 className="text-xl font-semibold text-gray-950 dark:text-white">
                Datos meteorológicos actuales
              </h2>
              <p className="text-gray-400 font-medium">{stringToday}</p>
            </div>
            <div>
              {readyState === ReadyState.CLOSED && (
                <span class="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                  <span class="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
                  Desconectado
                </span>
              )}
              {readyState === ReadyState.CONNECTING && (
                <span class="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 animate-pulse">
                  <span class="w-2 h-2 me-1 bg-blue-500 rounded-full"></span>
                  Conectando...
                </span>
              )}
              {readyState === ReadyState.OPEN && (
                <span class="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                  <span class="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                  Conectado
                </span>
              )}
            </div>
          </div>
        )}
        <Notifiactions notifications={notifications} dismissFn={dismissFn} />
        {view === "data" && (
          <>
            <Cards data={displayData}></Cards>
            <Chart />
          </>
        )}
        {view === "config" && <ConfigTab backFn={backFn} />}
      </div>
    </main>
  );
}
