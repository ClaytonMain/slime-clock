/**
 * Naming files is hard.
 */

import { useEffect, useState, type ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import TabContentScrollArea from "./TabContentScrollArea";

export default function TabContentDisplayAreaHtmlContent() {
  const controlsState = useSlimeStore((state) => state.controlsState);
  const [header, setHeader] = useState<string | null>(null);
  const [titleFontSize, setTitleFontSize] = useState<string>("2xl");
  const [content, setContent] = useState<string | ReactNode | null>(null);
  const [childrenPadding, setChildrenPadding] = useState<string[]>([]);

  useEffect(() => {
    const displayAreaContent = controlsState.displayAreaHtmlContent;
    if (!displayAreaContent) {
      setHeader(null);
      setTitleFontSize("2xl");
      setContent(null);
      setChildrenPadding([]);
    } else if (typeof displayAreaContent === "string") {
      setHeader(null);
      setTitleFontSize("2xl");
      setContent(displayAreaContent);
      setChildrenPadding(["py-1", "pr-4", "pl-2"]);
    } else if (Array.isArray(displayAreaContent)) {
      setHeader(displayAreaContent[0]);
      setTitleFontSize("lg");
      setContent(displayAreaContent[1]);
      if (displayAreaContent[1] && typeof displayAreaContent[1] === "string") {
        setChildrenPadding(["py-1", "pr-4", "pl-2"]);
      } else {
        setChildrenPadding([]);
      }
    } else {
      setHeader(null);
      setTitleFontSize("2xl");
      setContent(displayAreaContent);
      setChildrenPadding([]);
    }
  }, [controlsState]);

  return (
    <TabContentScrollArea
      title={header}
      titleFontSize={titleFontSize}
      childrenPadding={childrenPadding}
    >
      {content}
    </TabContentScrollArea>
  );
}
