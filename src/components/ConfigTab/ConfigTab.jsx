import { useEffect, useContext } from "preact/hooks";
import { ErrorBoundary, Router, Route, useLocation } from "preact-iso";
import WifiSection from "./sections/WifiSection";
import DataSection from "./sections/DataSection";
import AlarmsSection from "./sections/AlarmSection/AlarmsSection";
import ResetSection from "./sections/ResetSection";
import CalibrationSection from "./CalibrationSection";
import ExternalServerSection from "./sections/ExternalServerSection";
import { AuthContext } from "../../contexts/AuthContext";

const viewComponets = {
  wifi: WifiSection,
  data: DataSection,
  alarmas: AlarmsSection,
  reset: ResetSection,
  calibracion: CalibrationSection,
  servidor: ExternalServerSection,
};

export default function ConfigTab() {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (!token) location.route("/config");
  }, [token]);

  return (
    <div className="">
      <ErrorBoundary>
        <Router>
          {Object.keys(viewComponets).map((c) => (
            <Route path={`/${c}`} component={viewComponets[c]} />
          ))}
        </Router>
      </ErrorBoundary>
    </div>
  );
}
