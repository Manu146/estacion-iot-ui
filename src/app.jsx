import { useState, useEffect } from "preact/hooks";
import Modal from "react-modal";
import { ErrorBoundary, lazy, Router, useLocation } from "preact-iso";
import { useWebSocket, ReadyState } from "./hooks/useWs";
import Notifiactions from "./components/Notifications/Notificacions";
import { AuthProvider } from "./contexts/AuthContext";
import ConfigRoot from "./components/ConfigTab/ConfigRoot";

const Home = lazy(() => import("./routes/Home"));
const Config = lazy(() => import("./routes/Config"));

Modal.setAppElement("#app");

export function App() {
  const { readyState, lastMessage, send, status } = useWebSocket(
    "ws://localhost:3000/tiemporeal"
  );
  const [displayData, setDisplayData] = useState(null);
  const [notifications, setNotifications] = useState({
    critical: [],
    info: [],
  });
  const [tablData, setTableData] = useState([]);
  const location = useLocation();

  const dismissFn = (index) => {
    setNotifications((p) => ({
      ...p,
      critial: p["critical"].splice(index, 1),
    }));
  };

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      send("test message");
    }
  }, [readyState, send]);

  useEffect(() => {
    if (lastMessage) {
      const { tipo, data } = lastMessage;
      if (tipo === "datos") setDisplayData(data);
      if (tipo === "alarma") {
        const newCritical = data;
        setNotifications((p) => ({
          ...p,
          critical: [newCritical, ...p["critical"]],
        }));
      }
      if (tipo === "alarmas_activas") {
        if (notifications.critical.length > 0) {
          return setNotifications((prev) => ({ ...prev, critical: data }));
        } else {
          setNotifications((prev) => ({ ...prev, critical: data }));
        }
      }
      if (tipo === "alarmas_historico") {
        return setTableData(data);
      }
      if (tipo === "alarmas_historico_act") {
        return setTableData((prev) => [...data, ...prev]);
      }
    }
  }, [lastMessage]);

  return (
    <ErrorBoundary>
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 class="mb-6 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            Estación meteorológica IoT UC
          </h1>
          <div className="h-10 items-center justify-center rounded-md bg-gray-100 text-gray-400 dark:bg-gray-700 p-1 dark:text-gray-400 grid w-full grid-cols-2">
            <a
              href="/"
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                !location.path.includes("config")
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50"
                  : "bg-inherit text-inherit"
              }`}
            >
              Visualización
            </a>
            <a
              href="/config"
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                location.path.includes("config")
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50"
                  : "bg-inherit text-inherit"
              }`}
            >
              Configuración
            </a>
          </div>
          <Notifiactions notifications={notifications} dismissFn={dismissFn} />
          <AuthProvider>
            <Router>
              <Home
                path="/"
                displayData={displayData}
                tablData={tablData}
                readyState={readyState}
              />
              <ConfigRoot path="/config" />
              <Config path="/config/*" />
            </Router>
          </AuthProvider>
        </div>
      </main>
    </ErrorBoundary>
  );
}
