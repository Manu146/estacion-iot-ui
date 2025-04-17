import Cards from "../components/cards/Cards";
import Chart from "../components/chart/Chart";
import AlarmsTable from "../components/AlarmsTable/AlarmsTable";
import DownloadDataForm from "../components/DownloadDataForm";
import { ReadyState } from "../hooks/useWs";

const stringToday = new Date(Date.now()).toLocaleDateString("es-ES", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function Home({ displayData, tablData, readyState }) {
  return (
    <>
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm-items-center mt-4">
        <div className="">
          <h2 className="text-xl font-semibold text-gray-950 dark:text-white">
            Datos meteorológicos actuales
          </h2>
          <p className="text-gray-400 font-medium">{stringToday}</p>
        </div>
        <div>
          {readyState === ReadyState.CLOSED && (
            <span class="inline-flex items-center bg-red-100 text-red-800 text-sm font-medium me-2 px-3 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
              <span class="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
              Desconectado
            </span>
          )}
          {readyState === ReadyState.CONNECTING && (
            <span class="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium me-2 px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300 animate-pulse">
              <span class="w-2 h-2 me-1 bg-blue-500 rounded-full"></span>
              Conectando...
            </span>
          )}
          {readyState === ReadyState.OPEN && (
            <span class="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
              <span class="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
              Conectado
            </span>
          )}
        </div>
      </div>
      <Cards data={displayData}></Cards>
      <Chart />
      <AlarmsTable alarms={tablData} />
      <DownloadDataForm />
    </>
  );
}
