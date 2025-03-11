import LineChart from "./LineChart";
import Calendar from "./Calendar";
import { useState, useMemo, useEffect } from "preact/hooks";
import { BASE_URL } from "../../config";

function generateTemperatureData() {
  // Start time: July 10, 2024 00:00:00 UTC
  const startDate = new Date(Date.UTC(2024, 6, 10)); // Note: Months are 0-based (6 = July)
  const startUnix = Math.floor(startDate.getTime() / 1000);

  const data = [];
  const entries = 2 * 24 * 12; // 2 days × 24 hrs × 12 samples/hr (5-minute intervals)
  const secondsPerInterval = 300; // 5 minutes in seconds

  for (let i = 0; i < entries; i++) {
    const timestamp = startUnix + i * secondsPerInterval;
    // Simulate temperature fluctuations (20°C to 30°C daily cycle)
    const value =
      25 + 5 * Math.sin(((i * secondsPerInterval) / 86400) * Math.PI * 2);

    data.push({
      t: timestamp,
      sensor: "TemperatureDHT",
      value: Math.round(value * 100) / 100, // Round to 2 decimal places
    });
  }

  // Get first and last timestamps
  const firstTimestamp = data[0].t;
  const lastTimestamp = data[data.length - 1].t;

  return {
    data: data,
    first: {
      unix: firstTimestamp,
      utc: new Date(firstTimestamp * 1000).toISOString(),
    },
    last: {
      unix: lastTimestamp,
      utc: new Date(lastTimestamp * 1000).toISOString(),
    },
  };
}

function generateWeatherData(variable, frequency, startDate) {
  const data = [];
  const parsedFrequency = parseFrequency(frequency);
  const { type, interval } = parsedFrequency;

  // Value generation functions
  const generators = {
    temperatura: (date) => {
      const seasonal = Math.sin(((date.getMonth() - 2) * Math.PI) / 6) * 10; // Seasonal variation (±10°C)
      const daily =
        Math.sin(
          ((date.getHours() - 14 + date.getMinutes() / 60) * Math.PI) / 12
        ) * 5; // Daily variation (±5°C)
      return 20 + seasonal + daily; // Base 20°C with variations
    },
    presion: (date) => {
      const base = 1010;
      const daily = Math.sin(((date.getHours() - 2) * Math.PI) / 12) * 2; // Daily variation (±2hPa)
      return base + daily + (Math.random() - 0.5); // Random noise
    },
    humedad: (date) => {
      const base = 60;
      const daily = Math.sin(((date.getHours() - 5) * Math.PI) / 12) * -20; // Inverse daily variation
      const seasonal = Math.sin(((date.getMonth() - 2) * Math.PI) / 6) * -10; // Seasonal variation
      return Math.max(
        30,
        Math.min(85, base + daily + seasonal + (Math.random() * 10 - 5))
      );
    },
    solar: (date) => {
      const base = 60;
      const daily = Math.sin(((date.getHours() - 5) * Math.PI) / 12) * -20; // Inverse daily variation
      const seasonal = Math.sin(((date.getMonth() - 2) * Math.PI) / 6) * -10; // Seasonal variation
      return Math.max(
        30,
        Math.min(85, base + daily + seasonal + (Math.random() * 10 - 5))
      );
    },
  };

  // Generate timestamps based on frequency
  if (type === "daily") {
    const totalMinutes = 24 * 60;
    const steps = totalMinutes / interval;
    for (let i = 0; i < steps; i++) {
      const timestamp = new Date(startDate.getTime() + i * interval * 60000);
      data.push({
        t: timestamp.valueOf() / 1000,
        value: Number(generators[variable](timestamp).toFixed(1)),
      });
    }
  } else if (type === "monthly") {
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const timestamp = new Date(year, month, day, 12); // Noon for daily data
      data.push({
        t: timestamp.valueOf() / 1000,
        value: Number(generators[variable](timestamp).toFixed(1)),
      });
    }
  } else if (type === "yearly") {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    for (let i = 0; i < 12; i++) {
      const newMonth = startMonth + i;
      const year = startYear + Math.floor(newMonth / 12);
      const month = newMonth % 12;
      const timestamp = new Date(year, month, 15, 12); // Mid-month at noon
      data.push({
        t: timestamp.valueOf() / 1000,
        value: Number(generators[variable](timestamp).toFixed(1)),
      });
    }
  }

  return data;
}

function parseFrequency(frequency) {
  if (frequency.startsWith("daily")) {
    const parts = frequency.split("/");
    return {
      type: "daily",
      interval: parts.length > 1 ? parseInt(parts[1], 10) : 60, // Default to 60 minutes
    };
  }
  return { type: frequency, interval: null };
}

const fetchDayData = async (selectedDate, variable) => {
  const { year, month, day } = selectedDate;
  const res = await fetch(
    `${BASE_URL}datos?inicio=${
      new Date(year, month - 1, day).valueOf() / 1000
    }&variable=${variable}&frecuencia=diario`
  );
  return await res.json();
};

const fetchDayAvgs = async (selectedDate, variable) => {
  const { year, month } = selectedDate;
  let start = new Date(year, month - 1, 1).valueOf() / 1000;
  let end = new Date(year, month, 1).valueOf() / 1000;

  let res = await fetch(
    `${BASE_URL}datos?inicio=${start}&final=${end}&variable=${variable}&frecuencia=mensual`
  );
  return await res.json();
};

const fetchMonthAvgs = async (selectedDate, variable) => {
  const { year } = selectedDate;
  let start = new Date(year, 0, 1).valueOf() / 1000;
  let end = new Date(year + 1, 0, 1).valueOf() / 1000;

  let res = await fetch(
    `${BASE_URL}datos?inicio=${start}&final=${end}&variable=${variable}&frecuencia=anual`
  );
  return await res.json();
};

const fetchAvailableDates = async () => {
  try {
    const response = await fetch(`${BASE_URL}fechas`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching available dates:", error);
    return null;
  }
};

const formatData = (data, frequency) => {
  if (!data || !frequency) return null;
  if (frequency === "days") {
    const dataPoints = data.map(({ t, valor }) => valor);
    const labels = data.map(({ t, valor }) => {
      const d = new Date(t * 1000);
      return `${d.getHours().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}:${d.getMinutes().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}`;
    });
    return { dataPoints, labels };
  }

  if (frequency === "months") {
    const dataPoints = data.map(({ t, valor }) => valor);
    const labels = data.map(({ t, valor }) => {
      const d = new Date(t * 1000);
      return `${d.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}-${(d.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}`;
    });
    return { dataPoints, labels };
  }
  const dataPoints = data.map(({ t, valor }) => valor);
  const labels = data.map(({ t, valor }) => {
    const d = new Date(t * 1000);
    return `${(d.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })}-${d.getUTCFullYear()}`;
  });
  return { dataPoints, labels };
};

const variables = [
  { text: "Temperatura", value: "temperatura" },
  { text: "Presión", value: "presion" },
  { text: "Humedad", value: "humedad" },
  { text: "Solar", value: "solar" },
  { text: "Velocidad del viento", value: "velocidad" },
  { text: "Pluviosidad", value: "pluviosidad" },
];

export default function Chart() {
  const [frequency, setFrequency] = useState(null); //Day, week, Month
  const [variable, setVariable] = useState(null); //temperature, pressure, etc
  const [selectedDate, setSelectedDate] = useState({
    day: null,
    month: null,
    year: null,
  });
  const [fetchedData, setFetchedData] = useState(null);
  const [availableDays, setAvailableDays] = useState(null);

  const updateSelectedDate = (key, value) => {
    setSelectedDate((prev) => ({ ...prev, [key]: value }));
  };

  const startDate = availableDays ? availableDays[0] : null;
  const endDate = availableDays
    ? availableDays[availableDays.length - 1]
    : null;

  const selectedVariable = !!variable;

  const chartData = useMemo(
    () => formatData(fetchedData, frequency),
    [fetchedData, frequency]
  );

  useEffect(() => {
    fetchAvailableDates().then((data) => setAvailableDays(data));
  }, []);

  useEffect(async () => {
    try {
      const { day, year, month } = selectedDate;
      const datePresent = !!day || !!year || !!month;

      if (!frequency || !datePresent || !variable) return;

      if (frequency === "days" && !!day && !!year && !!month)
        return setFetchedData(
          (await fetchDayData(selectedDate, variable)).data
        );

      if (frequency === "months" && !!year && !!month)
        return setFetchedData(
          (await fetchDayAvgs(selectedDate, variable)).data
        );

      if (frequency === "years" && !!year)
        return setFetchedData(
          (await fetchMonthAvgs(selectedDate, variable)).data
        );
    } catch (e) {}
  }, [frequency, selectedDate, variable]);

  if (availableDays)
    return (
      <div className="shadow-sm mt-4 dark:bg-gray-900 bg-white p-6 rounded-lg border dark:border-gray-700 border-gray-200">
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gráfico de datos meteorológicos
          </h3>
          <p className="text-sm text-gray-400">
            Seleccione una variable, rango y frecuencia para visualizar los
            datos
          </p>
        </div>
        <div className="flex justify-normal flex-col gap-y-3 md:flex-row md:justify-between md:gap-y-0">
          <div className="">
            <label
              for="variable"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Variable:
            </label>
            <select
              id="variable"
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Variable</option>
              {variables.map((v) => (
                <option value={v.value}>{v.text}</option>
              ))}
            </select>
          </div>
          <Calendar
            startDate={startDate}
            endDate={endDate}
            frequency={frequency}
            setFrequency={setFrequency}
            selectedDate={selectedDate}
            updateSelectedDate={updateSelectedDate}
            selectedVariable={selectedVariable}
          />
        </div>
        {chartData && (
          <div className="mt-8">
            <LineChart
              formattedData={chartData}
              variable={variables.filter((v) => variable === v.value)[0].text}
            />
          </div>
        )}
      </div>
    );
  return (
    <div className="shadow-sm mt-4 dark:bg-gray-900 bg-white p-6 rounded-lg border dark:border-gray-700 border-gray-200 flex justify-center items-center">
      <div role="status">
        <svg
          aria-hidden="true"
          class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
}
