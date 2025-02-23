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
    <div className="flex flex-col items-center">
      <div className="align-top flex items-center pr-8">
        <Icon size={64} className={style} />
        <h1 class="text-8xl font-bold font-mono text-gray-900 dark:text-white">
          {value}
          <span className="text-lg inline-block pt-3 align-top">{unit}</span>
        </h1>
      </div>
      <h4 class="text-xl w-full font-normal text-gray-500 dark:text-gray-400 text-center">
        {capitalize(title)}
      </h4>
    </div>
  );
}
