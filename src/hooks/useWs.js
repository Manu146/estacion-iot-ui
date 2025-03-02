import { useState, useEffect, useCallback, useRef } from "preact/hooks";

// WebSocket ready state constants
export const ReadyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

// Status strings that correspond to ready states
export const ReadyStateStatus = {
  [ReadyState.CONNECTING]: "connecting",
  [ReadyState.OPEN]: "open",
  [ReadyState.CLOSING]: "closing",
  [ReadyState.CLOSED]: "closed",
};

/**
 * Custom hook for WebSocket connections in Preact
 *
 * @param {string} url The WebSocket URL to connect to
 * @param {object} options Configuration options for the WebSocket
 * @returns {object} Object containing readyState, lastMessage, send function, and status
 */
export function useWebSocket(url, options = {}) {
  const {
    reconnect = true,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
    onOpen,
    onMessage,
    onClose,
    onError,
  } = options;

  // Store the WebSocket instance in a ref so it persists across renders
  const ws = useRef(null);
  // Track reconnection attempts
  const reconnectCount = useRef(0);
  // Track if the component is mounted to prevent state updates after unmount
  const isMounted = useRef(false);

  // State for the WebSocket ready state
  const [readyState, setReadyState] = useState(ReadyState.CONNECTING);
  // State for the last received message
  const [lastMessage, setLastMessage] = useState(null);

  // Function to create a new WebSocket connection
  const connect = useCallback(() => {
    // Close existing connection if any
    if (ws.current) {
      ws.current.close();
    }

    // Create new WebSocket connection
    const websocket = new WebSocket(url);

    // Set up event handlers
    websocket.onopen = (event) => {
      if (isMounted.current) {
        setReadyState(ReadyState.OPEN);
        reconnectCount.current = 0;
        if (onOpen) onOpen(event);
      }
    };

    websocket.onmessage = (event) => {
      if (isMounted.current) {
        let data;
        try {
          // Try to parse JSON data
          data = JSON.parse(event.data);
        } catch (error) {
          // If not JSON, use raw data
          data = event.data;
        }
        setLastMessage(data);
        if (onMessage) onMessage(event);
      }
    };

    websocket.onclose = (event) => {
      if (isMounted.current) {
        setReadyState(ReadyState.CLOSED);
        if (onClose) onClose(event);

        // Handle reconnection
        if (reconnect && reconnectCount.current < reconnectAttempts) {
          reconnectCount.current += 1;
          setTimeout(() => {
            if (isMounted.current) {
              connect();
            }
          }, reconnectInterval);
        }
      }
    };

    websocket.onerror = (event) => {
      if (isMounted.current) {
        if (onError) onError(event);
      }
    };

    // Store the WebSocket instance
    ws.current = websocket;
  }, [
    url,
    reconnect,
    reconnectInterval,
    reconnectAttempts,
    onOpen,
    onMessage,
    onClose,
    onError,
  ]);

  // Function to send data through the WebSocket
  const send = useCallback((data) => {
    if (ws.current && ws.current.readyState === ReadyState.OPEN) {
      // If data is an object, stringify it
      if (
        typeof data === "object" &&
        !(data instanceof Blob) &&
        !(data instanceof ArrayBuffer)
      ) {
        ws.current.send(JSON.stringify(data));
      } else {
        ws.current.send(data);
      }
      return true;
    }
    return false;
  }, []);

  // Set up the WebSocket connection when the component mounts
  useEffect(() => {
    isMounted.current = true;
    connect();

    // Clean up when the component unmounts
    return () => {
      isMounted.current = false;
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  // Update ready state when the WebSocket state changes
  useEffect(() => {
    if (ws.current) {
      setReadyState(ws.current.readyState);

      const handleReadyStateChange = () => {
        if (isMounted.current && ws.current) {
          setReadyState(ws.current.readyState);
        }
      };

      // We can't directly listen for readyState changes, so we check on other events
      ws.current.addEventListener("open", handleReadyStateChange);
      ws.current.addEventListener("close", handleReadyStateChange);

      return () => {
        if (ws.current) {
          ws.current.removeEventListener("open", handleReadyStateChange);
          ws.current.removeEventListener("close", handleReadyStateChange);
        }
      };
    }
  }, []);

  // Get the status string from the ready state
  const status = ReadyStateStatus[readyState];

  return {
    readyState,
    lastMessage,
    send,
    status,
  };
}
