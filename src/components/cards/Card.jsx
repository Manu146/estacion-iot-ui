import {
  Thermometer,
  Gauge,
  Droplets,
  CloudRain,
  Sun,
  Wind,
  Compass,
} from "lucide-preact";

const variables = {
  temperatura: {
    icon: Thermometer,
    unit: "°C",
    style: "-mr-3 text-green-600",
  },
  presion: { icon: Gauge, unit: "atm", style: "mr-2 text-green-600" },
  humedad: { icon: Droplets, unit: "%", style: "text-green-600" },
  pluviosidad: { icon: CloudRain, unit: "mm", style: "mr-1 text-green-600" },
  solar: { icon: Sun, unit: "W/m2", style: "mr-2 text-green-600" },
  vientoVelocidad: { icon: Wind, unit: "m/s", style: "mr-2 text-green-600" },
  vientoDireccion: { icon: Compass, unit: "°", style: "mr-2 text-green-600" },
};

const capitalize = (text) => {
  return text[0].toUpperCase() + text.slice(1).toLowerCase();
};

export default function Card({ value, title, variable }) {
  const Icon = variables[variable].icon;
  const unit = variables[variable].unit;
  const style = variables[variable]?.style;
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
      <div className="p-6 flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-semibold text-gray-950 dark:text-white">
          {capitalize(title)}
        </h3>
        <Icon size={24} className="text-gray-500" />
      </div>
      <div className="p-6 pt-0">
        <span className="text-3xl font-bold text-gray-950 dark:text-white">
          {value} {unit}
        </span>
      </div>
    </div>
  );
}
