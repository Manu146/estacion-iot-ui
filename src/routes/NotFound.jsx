import { useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";

export default function NotFound() {
  const location = useLocation();
  useEffect(() => {
    location.route("/");
  });
  return <div>NotFound</div>;
}
