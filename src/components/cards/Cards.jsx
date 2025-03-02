import Card from "./Card";

export default function Cards({ data }) {
  return (
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
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
