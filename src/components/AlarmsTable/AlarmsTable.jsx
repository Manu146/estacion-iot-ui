import AlarmRow from "./AlarmRow";

export default function AlarmsTable({ alarms }) {
  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 p-6 dark:border-gray-700 border-gray-200 shadow-sm mt-4">
      <div className="flex flex-col p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          AlarmsTable
        </h3>
        <p className="text-sm text-gray-400">Hola</p>
      </div>
      <div className="p-6 pt-0">
        <div className="rounded-md border dark:border-gray-700 border-gray-200">
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm caption-botton">
              <thead className="[&_tr]:border-b dark:border-gray-700 border-gray-200">
                <tr className="border-b dark:border-gray-700 border-gray-200 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                  <th className="h-12 px-4 text-left align-middle font-semibold text-gray-500">
                    Tipo
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-semibold text-gray-500">
                    Variable
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-semibold text-gray-500">
                    Inicio
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-semibold text-gray-500">
                    Final
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-semibold text-gray-500">
                    Duración
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {alarms.map((al) => (
                  <AlarmRow alarm={al} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
