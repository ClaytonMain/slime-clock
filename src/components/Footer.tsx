import {
  ColorWheelIcon,
  MixerHorizontalIcon,
  TextIcon,
  TriangleUpIcon,
} from "@radix-ui/react-icons";
import { Button, Flex, IconButton, Section } from "@radix-ui/themes";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Dialog, Tabs, ToggleGroup } from "radix-ui";
import { useCallback, useEffect, useState } from "react";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string | undefined>(undefined);

  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", escFunction, false);
    } else {
      document.removeEventListener("keydown", escFunction, false);
    }
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [isOpen, escFunction]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
      animate={{
        backgroundColor: isOpen ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)",
      }}
      onClick={() => setIsOpen(false)}
    >
      <Section
        position="fixed"
        left="0"
        bottom="0"
        width="100%"
        p="4"
        onClick={(e) => e.stopPropagation()}
      >
        <LayoutGroup>
          <Tabs.Root
            value={selectedTab}
            onValueChange={setSelectedTab}
            activationMode="manual"
          >
            <Tabs.List asChild>
              <Flex align="center" justify="center" asChild gap="4">
                <motion.div layout>
                  <Tabs.Trigger
                    onClick={() => setIsOpen(true)}
                    value="Tab 1"
                    asChild
                  >
                    <IconButton
                      variant={
                        isOpen && selectedTab === "Tab 1" ? "solid" : "ghost"
                      }
                      size="2"
                      radius="full"
                    >
                      <TextIcon />
                    </IconButton>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    onClick={() => setIsOpen(true)}
                    value="Tab 2"
                    asChild
                  >
                    <IconButton
                      variant={
                        isOpen && selectedTab === "Tab 2" ? "solid" : "ghost"
                      }
                      size="2"
                      radius="full"
                    >
                      <MixerHorizontalIcon />
                    </IconButton>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    onClick={() => setIsOpen(true)}
                    value="Tab 3"
                    asChild
                  >
                    <IconButton
                      variant={
                        isOpen && selectedTab === "Tab 3" ? "solid" : "ghost"
                      }
                      size="2"
                      radius="full"
                    >
                      <ColorWheelIcon />
                    </IconButton>
                  </Tabs.Trigger>
                </motion.div>
              </Flex>
            </Tabs.List>
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  key="footer-dialog-content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  layout
                >
                  <Tabs.Content value="Tab 1">This is tab 1.</Tabs.Content>
                  <Tabs.Content value="Tab 2">This is tab 2.</Tabs.Content>
                  <Tabs.Content value="Tab 3">This is tab 3.</Tabs.Content>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs.Root>
        </LayoutGroup>
      </Section>
    </motion.div>
  );
}
