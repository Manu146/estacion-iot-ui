import { useState, useMemo } from "preact/hooks";

const frequencyValues = ["days", "months", "years"];

const DateRangeSelector = ({
  startDate,
  endDate,
  frequency,
  setFrequency,
  selectedDate,
  updateSelectedDate,
  selectedVariable,
}) => {
  const {
    day: selectedDay,
    month: selectedMonth,
    year: selectedYear,
  } = selectedDate;
  // Extract date components
  const start = startDate.split("-");
  const end = endDate.split("-");

  const startYear = parseInt(start[0]);
  const startMonth = parseInt(start[1]); // 0-based
  const startDay = parseInt(start[2]);
  const endYear = parseInt(end[0]);
  const endMonth = parseInt(end[1]);
  const endDay = parseInt(end[2]);

  // Generate years array
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  // Generate available months for selected year
  const months = useMemo(() => {
    if (!selectedYear || frequency === "years") return [];

    const minMonth = selectedYear === startYear ? startMonth : 1;
    const maxMonth = selectedYear === endYear ? endMonth : 12;

    return Array.from(
      { length: maxMonth - minMonth + 1 },
      (_, i) => minMonth + i
    );
  }, [selectedYear, frequency, startYear, startMonth, endYear, endMonth]);

  // Generate available days for selected year/month
  const days = useMemo(() => {
    if (frequency !== "days" || !selectedYear || !selectedMonth) return [];

    const monthIndex = selectedMonth; // Convert to 0-based
    const isStartMonth =
      selectedYear === startYear && monthIndex === startMonth;
    const isEndMonth = selectedYear === endYear && monthIndex === endMonth;

    const minDay = isStartMonth ? startDay : 1;
    const maxDay = isEndMonth
      ? endDay
      : new Date(selectedYear, selectedMonth, 0).getDate();

    return Array.from({ length: maxDay - minDay + 1 }, (_, i) => minDay + i);
  }, [
    selectedYear,
    selectedMonth,
    frequency,
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
  ]);

  // Handlers
  const handleFrequencyChange = (e) => {
    const newFrequency = e.target.value;
    setFrequency(newFrequency);
    if (newFrequency === "years") {
      updateSelectedDate("month", null);
      updateSelectedDate("day", null);
    } else if (newFrequency === "months") {
      updateSelectedDate("day", null);
    }
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    updateSelectedDate("year", year);
    updateSelectedDate("month", null);
    updateSelectedDate("day", null);
  };

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value);
    updateSelectedDate("month", month);
    updateSelectedDate("day", null);
  };

  const handleDayChange = (e) => {
    updateSelectedDate("day", parseInt(e.target.value));
  };

  return (
    <div className="flex gap-8">
      <div className="">
        <label
          for="frequency"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Frecuencia:
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={handleFrequencyChange}
          disabled={!selectedVariable}
          class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:text-gray-500"
        >
          <option value="">Selecciona frecuencia</option>
          <option value="days">Días</option>
          <option value="months">Meses</option>
          <option value="years">Años</option>
        </select>
      </div>

      <div className="">
        <label
          for="frequency"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Año:
        </label>
        <select
          id="year"
          value={selectedYear || ""}
          onChange={handleYearChange}
          disabled={!frequency || !years.length || !selectedVariable}
          class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:text-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Selecciona año</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="">
        <label
          for="month"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Mes:
        </label>
        <select
          id="month"
          value={selectedMonth || ""}
          onChange={handleMonthChange}
          disabled={
            !frequency ||
            frequency === "years" ||
            !selectedYear ||
            !months.length ||
            !selectedVariable
          }
          class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:text-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Selecciona mes</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="">
        <label
          for="day"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Dia:
        </label>
        <select
          id="day"
          value={selectedDay || ""}
          onChange={handleDayChange}
          disabled={
            !frequency ||
            frequency !== "days" ||
            !selectedMonth ||
            !days.length ||
            !selectedVariable
          }
          class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:text-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Selecciona día</option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DateRangeSelector;
