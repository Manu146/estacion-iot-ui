import Card from "./Card";

export default function Cards({ data }) {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 container bg-gray-50 shadow-sm dark:bg-gray-800 p-6 rounded-lg border-2 dark:border-gray-700 border-gray-100">
      <Card
        title="temperatura"
        value={data?.temperatura?.valor.toPrecision(3) || "--"}
        variable="temperatura"
      />
      <Card
        title="humedad"
        value={data?.humedad?.valor.toPrecision(3) || "--"}
        variable="humedad"
      />
      <Card
        title="Presión"
        value={data?.presion?.valor.toPrecision(3) || "--"}
        variable="presion"
      />
      <Card
        title="solar"
        value={data?.solar?.valor.toPrecision(3) || "--"}
        variable="solar"
      />
      <Card
        title="pluviosidad"
        value={data?.pluviosidad?.valor.toPrecision(3) || "--"}
        variable="pluviosidad"
      />
      <Card
        title="Velocidad del viento"
        value={data?.velocidad?.valor.toPrecision(3) || "--"}
        variable="vientoVelocidad"
      />
      <Card
        title="Dirección del viento"
        value={data?.direccion?.valor.toPrecision(3) || "--"}
        variable="vientoDireccion"
      />
    </div>
  );
}
