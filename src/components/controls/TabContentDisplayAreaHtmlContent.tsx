import { useEffect, useState, type ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import TabContentScrollArea from "./TabContentScrollArea";

export default function TabContentDisplayAreaHtmlContent() {
  const controlsState = useSlimeStore((state) => state.controlsState);
  const [header, setHeader] = useState<string | null>(null);
  const [titleFontSize, setTitleFontSize] = useState<string>("1.5rem");
  const [content, setContent] = useState<string | ReactNode | null>(null);
  const [childrenPadding, setChildrenPadding] = useState<string[]>([]);
  const [hideBackground, setHideBackground] = useState<boolean>(
    controlsState.hideDisplayAreaBackground,
  );

  useEffect(() => {
    const displayAreaContent = controlsState.displayAreaHtmlContent;
    if (!displayAreaContent) {
      setHeader(null);
      setTitleFontSize("1.5rem");
      setContent(null);
      setChildrenPadding(["py-1", "pr-4", "pl-2"]);
    } else if (typeof displayAreaContent === "string") {
      setHeader(null);
      setTitleFontSize("1.5rem");
      setContent(displayAreaContent);
      setChildrenPadding(["py-1", "pr-4", "pl-2"]);
    } else if (Array.isArray(displayAreaContent)) {
      setHeader(displayAreaContent[0]);
      setTitleFontSize("1.125rem");
      setContent(displayAreaContent[1]);
      if (displayAreaContent[1] && typeof displayAreaContent[1] === "string") {
        setChildrenPadding(["py-1", "pr-4", "pl-2"]);
      } else {
        setChildrenPadding([]);
      }
    } else {
      setHeader(null);
      setTitleFontSize("1.5rem");
      setContent(displayAreaContent);
      setChildrenPadding([]);
    }
    setHideBackground(controlsState.hideDisplayAreaBackground);
  }, [controlsState]);

  return (
    <>
      {(header || content) && (
        <TabContentScrollArea
          title={header}
          titleFontSize={titleFontSize}
          childrenPadding={childrenPadding}
          hideBackground={hideBackground}
        >
          {content}
        </TabContentScrollArea>
      )}
    </>
  );
}
