import { useState, useEffect } from "preact/hooks";
import { Settings, MoveLeft } from "lucide-preact";
import { useWs } from "./hooks/useWs";
import Cards from "./components/cards/Cards";
import Chart from "./components/chart/Chart";
import ConfigForm from "./configForm/configForm";

/*function generateTestData(startDate, endDate) {
  const data = [];
  let currentTime = startDate.getTime();

  while (currentTime <= endDate.getTime()) {
    // Simulate temperature fluctuations (you can customize this)
    const baseTemp = 20; // Adjust the base temperature
    const fluctuation =
      Math.sin((currentTime / (1000 * 60 * 60 * 24)) * 2 * Math.PI) * 5; // Sinusoidal fluctuation
    const randomNoise = (Math.random() - 0.5) * 2; // Small random noise

    const temperature = baseTemp + fluctuation + randomNoise;

    data.push([currentTime / 1000, parseFloat(temperature.toFixed(2))]); // Unix timestamp, temperature (2 decimal places)

    currentTime += 60 * 60 * 1000; // Increment by 5 minutes (in milliseconds)
  }

  return data;
}

const startDate = new Date("2024-03-01T00:00:00");
const endDate = new Date("2024-04-31T23:59:59");*/

export function App() {
  const [view, setView] = useState("data"); //Data, Config
  const [ready, val, send] = useWs("ws://localhost:3000"); //`ws://${window.location.host}/ws`);
  const [displayData, setDisplayData] = useState({});
  const [criticalData, setCriticalData] = useState({});
  /*const testData = useMemo(
    () => generateTestData(startDate, endDate),
    [startDate, endDate]
  );*/
  useEffect(() => {
    if (ready) {
      send("test message");
    }
  }, [ready, send]); // make sure to include send in dependency array

  useEffect(() => {
    if (val) {
      if (val.type === "sensorData") setDisplayData(val.data);
      if (val.type === "criticalData") setCriticalData(val.data);
    }
  }, [val]);

  const Icon = view === "data" ? Settings : MoveLeft;
  return (
    <div className="flex items-center flex-col pt-8 gap-y-6 p-4">
      <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Estación meteorológica IoT
      </h1>
      <div className="container flex justify-end w-full">
        <button
          type="button"
          onClick={() => setView(view === "data" ? "config" : "data")}
          class="text-gray-600 bg-gray-50 hover:bg-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 border-2 dark:border-gray-600 border-gray-100 dark:text-white"
        >
          <Icon size={32} />
          <span class="sr-only">Icon description</span>
        </button>
      </div>
      {view === "data" && (
        <>
          <Cards data={displayData}></Cards>
          <Chart />
        </>
      )}
      {view === "config" && <ConfigForm />}
    </div>
  );
}
