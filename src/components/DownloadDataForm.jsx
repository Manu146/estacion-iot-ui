import { useState, useEffect } from "preact/hooks";
import { BASE_URL } from "../config";

export default function DownloadDataForm() {
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [days, setDays] = useState([]);
  const [datesRange, setDatesRange] = useState([]);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);

  // Fetch available years, months, and days from the "/fechas" endpoint
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch(BASE_URL + "fechas");
        const data = await response.json();
        const start = data[0].split("-");
        const end = data[1].split("-");

        const startYear = parseInt(start[0]);
        const endYear = parseInt(end[0]);

        setYears(
          Array.from(
            { length: endYear - startYear + 1 },
            (_, i) => startYear + i
          )
        );
        setMonths([]);
        setDays([]);

        setDatesRange(data);
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
    };

    fetchDates();
  }, []);

  useEffect(() => {
    if (year) {
      const start = datesRange[0].split("-");
      const end = datesRange[1].split("-");

      const startMonth = parseInt(start[1]); // 0-based
      const endMonth = parseInt(end[1]);

      const minMonth = year === years[0] ? startMonth : 1;
      const maxMonth = year === years[years.lenght - 1] ? endMonth : 12;

      setMonths(
        Array.from({ length: maxMonth - minMonth + 1 }, (_, i) => minMonth + i)
      );
    }
  }, [year]);

  useEffect(() => {
    if (month) {
      const start = datesRange[0].split("-");
      const end = datesRange[1].split("-");

      const startDay = parseInt(start[2]);
      const endDay = parseInt(end[2]);

      const isStartMonth = year === years[0] && month === start[1];
      const isEndMonth = year === years[years.length - 1] && month === end[1];

      const minDay = isStartMonth ? startDay : 1;
      const maxDay = isEndMonth ? endDay : new Date(year, month, 0).getDate();

      setDays(
        Array.from({ length: maxDay - minDay + 1 }, (_, i) => minDay + i)
      );
    }
  }, [month]);

  const handleDownload = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!year || !month || !day) {
      return;
    }

    const url = `/datos/descargar?anio=${year}&mes=${month}&dia=${day}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `datos_${year}-${month}-${day}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("Error al descargar los datos.");
      }
    } catch (error) {
      console.error("Error during download:", error);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Descargar datos
      </h3>
      <form
        onSubmit={handleDownload}
        className="flex flex-wrap items-center gap-8"
      >
        <div className="flex-1">
          <label
            htmlFor="year"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Año:
          </label>
          <select
            id="year"
            value={year || ""}
            onChange={(e) => setYear(e.target.value)}
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
          >
            <option value="">Selecciona año</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label
            htmlFor="month"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Mes:
          </label>
          <select
            id="month"
            value={month || ""}
            onChange={(e) => setMonth(e.target.value)}
            disabled={!year}
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500 disabled:text-gray-500"
          >
            <option value="">Selecciona mes</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label
            htmlFor="day"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Día:
          </label>
          <select
            id="day"
            value={day || ""}
            onChange={(e) => setDay(e.target.value)}
            disabled={!month}
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500 disabled:text-gray-500"
          >
            <option value="">Selecciona día</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center self-end px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Descargar
        </button>
      </form>
    </div>
  );
}
