import Card from "./Card";

const formatNumber = (nString) => {
  return nString ? parseFloat(nString).toPrecision(3) : "--";
};

export default function Cards({ data = {} }) {
  return (
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
      <Card
        title="temperatura"
        value={formatNumber(data?.temperatura)}
        variable="temperatura"
      />
      <Card
        title="humedad"
        value={formatNumber(data?.humedad)}
        variable="humedad"
      />
      <Card
        title="Presión"
        value={formatNumber(data?.presion)}
        variable="presion"
      />
      <Card title="solar" value={formatNumber(data?.solar)} variable="solar" />
      <Card
        title="pluviosidad"
        value={formatNumber(data?.pluviosidad)}
        variable="pluviosidad"
      />
      <Card
        title="Velocidad del viento"
        value={formatNumber(data?.velocidad)}
        variable="vientoVelocidad"
      />
      <Card
        title="Dirección del viento"
        value={formatNumber(data?.direccion)}
        variable="vientoDireccion"
      />
    </div>
  );
}
