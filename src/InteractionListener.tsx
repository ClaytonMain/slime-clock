import { produce } from "immer";
import { useEffect, useState } from "react";
import useSlimeStore from "./stores/useSlimeStore";

export default function InteractionListener() {
  const [lastInteractionAt, setLastInteractionAt] = useState<number>(
    Date.now(),
  );

  function handleInteraction() {
    setLastInteractionAt(Date.now());
    useSlimeStore.setState(
      produce((state) => {
        if (state.interactionState !== "active") {
          state.interactionState = "active";
        }
      }),
    );
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      useSlimeStore.setState(
        produce((state) => {
          state.interactionState = "inactive";
        }),
      );
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [lastInteractionAt]);

  useEffect(() => {
    const eventTypes = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "keyup",
      "touchend",
    ];
    eventTypes.forEach((eventType) => {
      window.addEventListener(eventType, handleInteraction);
    });
    return () =>
      eventTypes.forEach((eventType) => {
        window.removeEventListener(eventType, handleInteraction);
      });
  }, []);

  return null;
}
