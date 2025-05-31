import { TriangleUpIcon } from "@radix-ui/react-icons";
import { Container, Flex, IconButton, Section } from "@radix-ui/themes";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Section
      position="fixed"
      left="0"
      bottom="0"
      width="100%"
      p="4"
    >
      <LayoutGroup>
        <Flex
          direction="column"
          align="center"
          justify="center"
          asChild
        >
          <motion.div
            key="footer-container"
            layout
          >
            <Container asChild>
              <motion.div
                key="footer-arrow-icon-button"
                layout
              >
                <IconButton
                  onClick={() => setIsOpen(!isOpen)}
                  variant="ghost"
                  size="1"
                  radius="full"
                >
                  <TriangleUpIcon
                    width="3rem"
                    height="3rem"
                  />
                </IconButton>
              </motion.div>
            </Container>
            <AnimatePresence mode="wait">
              {isOpen && (
                <Flex
                  direction="column"
                  align="center"
                  asChild
                >
                  <motion.div
                    key="footer-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: { type: "spring" },
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    layout
                  >
                    <Container
                      asChild
                      width="100%"
                    >
                      <motion.div layout>
                        <p>Made with ❤️ by Slime</p>
                        <p>© {new Date().getFullYear()} SlimeClock</p>
                      </motion.div>
                    </Container>
                  </motion.div>
                </Flex>
              )}
            </AnimatePresence>
          </motion.div>
        </Flex>
      </LayoutGroup>
    </Section>
  );
}
