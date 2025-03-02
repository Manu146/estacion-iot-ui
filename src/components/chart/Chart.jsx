import LineChart from "./LineChart";
import Calendar from "./Calendar";
import { useState, useMemo, useEffect } from "preact/hooks";

const BASE_API_URL = "http://localhost:3000/";

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
  console.log("day");
  const { year, month, day } = selectedDate;
  /*return generateWeatherData(
    variable,
    "daily/5",
    new Date(Date.UTC(year, month + 1, day))
  );*/
  const res = await fetch(
    `${BASE_API_URL}datos?inicio=${new Date(
      Date.UTC(year, month + 1, day)
    ).valueOf()}&variable=${variable}&frecuencia=diario`
  );
  return await res.json();
};

const fetchDayAvgs = async (selectedDate, variable) => {
  console.log("month");
  const { year, month } = selectedDate;
  let start = new Date(Date.UTC(year, month + 1, 1)).valueOf();
  let end = new Date(Date.UTC(year, month + 2, 1)).valueOf();
  /*return generateWeatherData(
    variable,
    "monthly",
    new Date(Date.UTC(year, month + 1, 1))
  );*/
  let res = await fetch(
    `${BASE_API_URL}datos?inicio=${start}&final=${end}&variable=${variable}&frecuencio=mensual`
  );
  return await res.json();
};

const fetchMonthAvgs = async (selectedDate, variable) => {
  console.log("year");
  const { year } = selectedDate;
  let start = new Date(Date.UTC(year, month + 1, 1)).valueOf();
  let end = new Date(Date.UTC(year + 1, month + 1, 1)).valueOf();
  /*return generateWeatherData(
    variable,
    "monthly",
    new Date(Date.UTC(year, month + 1, 1))
  );*/
  let res = await fetch(
    `${BASE_API_URL}datos?inicio=${start}&final=${end}&variable=${variable}&frecuencia=anual`
  );
  return await res.json();
};

const fetchAvailableDates = async () => {
  try {
    const response = await fetch(`${BASE_API_URL}fechas`);
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
      return `${d.getUTCHours().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}:${d.getUTCMinutes().toLocaleString("en-US", {
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
      return `${d.getUTCDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}-${(d.getUTCMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}`;
    });
    return { dataPoints, labels };
  }
  const dataPoints = data.map(({ t, valor }) => valor);
  const labels = data.map(({ t, valor }) => {
    const d = new Date(t * 1000);
    return `${(d.getUTCMonth() + 1).toLocaleString("en-US", {
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

  //console.log(chartData);

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
            <LineChart formattedData={chartData} />
          </div>
        )}
      </div>
    );
  return <div>Cargando..</div>;
}
