import LineChart from "./LineChart";
import Calendar from "./Calendar";
import { useState, useMemo, useEffect } from "preact/hooks";

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

const fetchDayData = (selectedDate, variable) => {
  console.log("day");
  const { year, month, day } = selectedDate;
  return generateWeatherData(
    variable,
    "daily/5",
    new Date(Date.UTC(year, month + 1, day))
  );
};

const fetchDayAvgs = (selectedDate, variable) => {
  console.log("month");
  const { year, month } = selectedDate;
  return generateWeatherData(
    variable,
    "monthly",
    new Date(Date.UTC(year, month + 1, 1))
  );
};

const fetchMonthAvgs = (selectedDate, variable) => {
  console.log("year");
  const { year } = selectedDate;
  return generateWeatherData(
    variable,
    "yearly",
    new Date(Date.UTC(year, 0, 1))
  );
};

const formatData = (data, frequency) => {
  if (!data || !frequency) return null;
  if (frequency === "days") {
    const dataPoints = data.map(({ t, value }) => value);
    const labels = data.map(({ t, value }) => {
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
    const dataPoints = data.map(({ t, value }) => value);
    const labels = data.map(({ t, value }) => {
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
  const dataPoints = data.map(({ t, value }) => value);
  const labels = data.map(({ t, value }) => {
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
    const data = generateTemperatureData();
    const days = [data.first.utc.split("T")[0], data.last.utc.split("T")[0]];
    setAvailableDays(days);
  }, []);

  useEffect(() => {
    const { day, year, month } = selectedDate;
    const datePresent = !!day || !!year || !!month;

    if (!frequency || !datePresent || !variable) return;

    if (frequency === "days" && !!day && !!year && !!month)
      return setFetchedData(fetchDayData(selectedDate, variable));

    if (frequency === "months" && !!year && !!month)
      return setFetchedData(fetchDayAvgs(selectedDate, variable));

    if (frequency === "years" && !!year)
      return setFetchedData(fetchMonthAvgs(selectedDate, variable));
  }, [frequency, selectedDate, variable]);

  //console.log(chartData);

  if (availableDays)
    return (
      <div className="container shadow-sm dark:bg-gray-800 bg-gray-50 p-6 rounded-lg border-2 dark:border-gray-700 border-gray-100">
        <div className="flex justify-normal flex-col gap-y-3 md:flex-row md:justify-between md:gap-y-0">
          <div className="">
            <label
              for="variable"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Selecciona una variable:
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
