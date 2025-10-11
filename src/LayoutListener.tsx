import { produce } from "immer";
import { useEffect } from "react";
import useSlimeStore from "./stores/useSlimeStore";

export default function LayoutListener() {
  function handleViewportResize() {
    const layout =
      window.innerWidth > window.innerHeight ? "landscape" : "portrait";
    const storeLayout =
      useSlimeStore.getState().controlsState.portraitOrLandscape;
    if (layout !== storeLayout) {
      useSlimeStore.setState(
        produce((state) => {
          state.controlsState.portraitOrLandscape = layout;
        }),
      );
    }
  }
  useEffect(() => {
    window.addEventListener("resize", handleViewportResize);
    return () => {
      window.removeEventListener("resize", handleViewportResize);
    };
  }, []);

  return null;
}
