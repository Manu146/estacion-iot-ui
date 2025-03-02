import { useState, useEffect } from "preact/hooks";
import {
  BellRing,
  Wifi,
  CloudUpload,
  HardDriveDownload,
  Wrench,
  RotateCcw,
} from "lucide-preact";
import WifiSection from "./sections/WifiSection";
import DataSection from "./sections/DataSection";
import AlarmsSection from "./sections/AlarmSection/AlarmsSection";
import ResetSection from "./sections/ResetSection";
import LoginModal from "./LoginModal";
import ConfigSectionCard from "./ConfigSectionCard";
import CalibrationSection from "./CalibrationSection";
import ExternalServerSection from "./sections/ExternalServerSection";

const BASE_API_URL = "http://localhost:3000/";

const fetchConfig = async () => {
  const res = await fetch(BASE_API_URL + "config");
  return await res.json();
};

const saveConfig = (data) => {
  console.log(data);
};

const viewComponets = {
  wifi: WifiSection,
  data: DataSection,
  alarmas: AlarmsSection,
  reset: ResetSection,
  calibracion: CalibrationSection,
  servidor: ExternalServerSection,
};

const configCards = {
  wifi: {
    icon: Wifi,
    text: "Modo de trabajo, credenciales de acceso a la red",
    title: "Red",
  },
  servidor: {
    icon: CloudUpload,
    text: "Exportar los datos a un servidor externo, en formato JSON",
    title: "Servidor externo",
  },
  data: {
    icon: HardDriveDownload,
    text: "Intervalo de toma de datos",
    title: "Toma de datos",
  },
  alarmas: {
    icon: BellRing,
    text: "Alarmas de nivel bajo y alto",
    title: "Alarmas",
  },
  calibracion: {
    icon: Wrench,
    text: "Ajuste de la calibración de los sensores",
    title: "Calibración",
  },
  reset: {
    icon: RotateCcw,
    text: "Restablecer valores por defecto",
    title: "Restablecer dispositivo",
  },
};

export default function ConfigTab({ backFn }) {
  const [configView, setConfigView] = useState("");
  const [token, setToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const ViewComponent = configView ? viewComponets[configView] : null;
  const factoryReset = () => {
    console.log("Reset de fábrica");
  };

  useEffect(() => {
    if (!token) setIsOpen(true);
    else setIsOpen(false);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  const closeModalBack = () => {
    setIsOpen(false);
    backFn();
  };

  const loginFn = (password) => {
    closeModal;
  };

  const handleViewChange = (e) => {
    setConfigView(e.target.name);
  };

  return (
    <div className="mt-6">
      <LoginModal
        isOpen={false}
        closeModal={closeModal}
        loginFn={loginFn}
        closeModalBack={closeModalBack}
      />
      <>
        {configView ? (
          <ViewComponent
            backFn={() => setConfigView(null)}
            config={{ alarmas: [] }}
          />
        ) : (
          <div className="">
            <h2 class="text-2xl font-semibold text-gray-950 dark:text-gray-50 mb-2">
              Configuración de la estación
            </h2>
            <p class="text-base font-normal text-gray-500 lg:text-lg dark:text-gray-400 mb-6">
              Administra la configuración y las preferencias
            </p>
            <div className="grid gride-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(configCards).map((card) => (
                <ConfigSectionCard
                  card={{ name: card, ...configCards[card] }}
                  handleViewChange={handleViewChange}
                />
              ))}
            </div>
          </div>
        )}
      </>
    </div>
  );
}
