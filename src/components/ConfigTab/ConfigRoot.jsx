import {
  BellRing,
  Wifi,
  CloudUpload,
  HardDriveDownload,
  Wrench,
  RotateCcw,
} from "lucide-preact";
import ConfigSectionCard from "./ConfigSectionCard";
import LoginModal from "./LoginModal";
import { useContext, useState, useEffect } from "preact/hooks";
import { AuthContext } from "../../contexts/AuthContext";
import { useLocation } from "preact-iso";

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

export default function ConfigRoot() {
  const [isOpen, setIsOpen] = useState(false);
  const { token, setToken } = useContext(AuthContext);
  const location = useLocation();
  const closeModal = () => setIsOpen(false);
  const closeModalBack = () => {
    closeModal();
    location.route("/");
  };

  useEffect(() => {
    if (!token) setIsOpen(true);
    else setIsOpen(false);
  }, [token]);

  return (
    <div className="mt-6">
      <LoginModal
        isOpen={isOpen}
        setToken={setToken}
        closeModal={closeModal}
        closeModalBack={closeModalBack}
      />
      <div className="">
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-gray-50 mb-2">
          Configuración de la estación
        </h2>
        <p class="text-base font-normal text-gray-500 lg:text-lg dark:text-gray-400 mb-6">
          Administra la configuración y las preferencias
        </p>
        <div className="grid gride-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.keys(configCards).map((card) => (
            <ConfigSectionCard card={{ name: card, ...configCards[card] }} />
          ))}
        </div>
      </div>
    </div>
  );
}
