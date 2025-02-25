import { useState, useEffect, useRef } from "preact/hooks";

export function useWs(url) {
  const [ready, setReady] = useState(false);
  const [val, setVal] = useState(null);
  const [status, setStatus] = useState("connecting"); // New state for connection status
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setReady(true);
      setStatus("connected");
    };

    ws.current.onmessage = (event) => {
      setVal(JSON.parse(event.data));
    };

    ws.current.onclose = () => {
      setReady(false);
      setStatus("disconnected");
    };

    ws.current.onerror = () => {
      setStatus("error");
    };

    return () => {
      ws.current.close();
    };
  }, [url]);

  const send = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    }
  };

  return [ready, val, send, status]; // Return status
}
