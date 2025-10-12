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
            labelHoverTabContentDisplay={["Links", "It's just links."]}
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
            labelHoverTabContentDisplay={[
              "Credits",
              "Acknowledgements & such.",
            ]}
          >
            <ControlGroup>
              <div className="flex flex-col gap-2 text-[1.0rem] text-sky-50">
                <div>
                  {"Inspired (heavily) by Sebastian Lague's "}
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
            </ControlGroup>
          </AccordionControlsItem>
          <AccordionControlsItem
            value="information"
            label="Information"
            labelHoverTabContentDisplay={["Information", "What is this?"]}
          >
            <ControlGroup>
              <div className="text-md flex flex-col gap-2 text-sky-50">
                <p>
                  For real, go watch that <em>Coding Adventure</em> video. A lot
                  of the same terminology (agents, trails, etc.) is used here.
                  Plus, it's a good video.
                </p>
                <br />
                <p>
                  Anywho, I was working on adapting that slime mold simulation
                  to work in a browser, and thought "Hey, this would make for a
                  neat clock". And so, here we are. There are a lot more
                  features I'd like to add, plus the code really needs to be
                  cleaned up, but I've been working on this for way longer than
                  I had originally intended, and I've got{" "}
                  <em>so many other projects</em> I'd like to work on, so this
                  is where I'm stopping for now.
                </p>
                <br />
                <br />
                <p>
                  Check out the source code (the GitHub link above) if you're
                  interested. Feel free to open issues or submit pull requests
                  if you have suggestions or improvements.
                </p>
              </div>
            </ControlGroup>
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
