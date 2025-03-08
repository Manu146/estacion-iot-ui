const variablesNombres = {
  humedad: "Humedad",
  temperatura: "Temperatura",
  presion: "Presión",
  velocidad: "Velocidad del viento",
  pluviosidad: "Pluviosidad",
  solar: "Potencia panel solar",
};

const formatDuration = (tInicio, tFinal) => {
  let h = Math.floor((tFinal - tInicio) / 3600);
  let m = Math.floor(((tFinal - tInicio) % 3600) / 60);
  let sH = h > 0 ? `${h} ${h > 1 ? "horas" : "hora"}` : "";
  let sM = m > 0 ? ` ${m} ${m > 1 ? "minutos" : "minuto"}` : "";
  return sH + sM;
};

export default function AlarmRow({ alarm }) {
  const { t_inicio, t_final, tipo_evento, variable } = alarm;

  return (
    <tr className="border-b dark:border-gray-700 border-gray-200 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-950 dark:text-gray-50">
      <td className="p-4 align-middle">
        {tipo_evento.charAt(0).toUpperCase() + tipo_evento.slice(1)}
      </td>
      <td className="p-4 align-middle">{variablesNombres[variable]}</td>
      <td className="p-4 align-middle">
        {new Date(t_inicio * 1000).toLocaleString("en-US", {})}
      </td>
      <td className="p-4 align-middle">
        {new Date(t_final * 1000).toLocaleString("en-US", {})}
      </td>
      <td className="p-4 align-middle">{formatDuration(t_inicio, t_final)}</td>
    </tr>
  );
}
