import { produce } from "immer";
import { motion } from "motion/react";
import { useEffect } from "react";
import { FaGithubSquare, FaLinkedin } from "react-icons/fa";
import useSlimeStore from "../../stores/useSlimeStore";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ControlGroup from "./ControlGroup";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function InfoControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);

  const infoLabelHoverTabContentDisplay = ["Information"];

  useEffect(() => {
    if (selectedTab !== "info-controls") return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaHtmlContent =
          infoLabelHoverTabContentDisplay;
        state.controlsState.displayAreaContentName = null;
        state.controlsState.hideDisplayAreaBackground = false;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  return (
    <TabContentContainer tabsValue="info-controls">
      <TabContentScrollArea title="Information">
        <AccordionControlsWrapper
          accordionId="info-controls-accordion"
          type="multiple"
          defaultValue={["links", "credits", "information"]}
        >
          <AccordionControlsItem
            value="links"
            label="Links"
            labelHoverTabContentDisplay={["Links"]}
          >
            <ControlGroup justifyContent="center">
              <motion.a
                href="https://www.linkedin.com/in/clayton-main/"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1.5 my-2 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaLinkedin className="h-10 w-10" />
                </motion.div>
              </motion.a>
              <motion.a
                href="https://github.com/ClaytonMain/slime-clock"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1.5 my-2 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithubSquare className="h-10 w-10" />
                </motion.div>
              </motion.a>
            </ControlGroup>
          </AccordionControlsItem>
          <AccordionControlsItem
            value="credits"
            label="Credits"
            labelHoverTabContentDisplay={["Credits"]}
          >
            <div className="flex flex-col gap-2 px-2 py-1 text-[1.0rem] text-sky-50">
              <div>
                {"Inspired by Sebastian Lague's "}
                {
                  <a
                    href="https://www.youtube.com/watch?v=X-iSQQgOd1A"
                    className="cursor-pointer text-sky-400 italic underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Coding Adventure: Ant and Slime Simulations
                  </a>
                }
                {" video."}
              </div>
              <div>
                {"Couldn't have done this without:"}
                <ul className="list-inside list-disc">
                  <li>
                    <a
                      href="https://iquilezles.org/"
                      className="cursor-pointer text-sky-400 italic underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Iñigo Quílez's
                    </a>
                    {" extensive shader references."}
                  </li>
                  <li>
                    <a
                      href="https://threejs-journey.com/"
                      className="cursor-pointer text-sky-400 italic underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Bruno Simon's
                    </a>
                    {" incredible Three.js Journey course."}
                  </li>
                </ul>
              </div>
            </div>
          </AccordionControlsItem>
          <AccordionControlsItem
            value="information"
            label="Information"
            labelHoverTabContentDisplay={["Information"]}
          >
            <div className="text-md flex flex-col px-2 py-1 text-sky-50"></div>
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
