import { TriangleUpIcon } from "@radix-ui/react-icons";
import { Dialog, Flex, IconButton, Section } from "@radix-ui/themes";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Dialog as DialogPrimitive } from "radix-ui";
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
        <Dialog.Root
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <Flex
            direction="column"
            align="center"
            justify="center"
            asChild
          >
            <motion.div
              key="footer-content-flex-container"
              layout
            >
              <Flex
                direction="column"
                align="center"
                asChild
              >
                <motion.div
                  key="footer-button-flex-container"
                  layout
                >
                  <Dialog.Trigger>
                    <IconButton
                      variant="ghost"
                      size="1"
                      radius="full"
                    >
                      <TriangleUpIcon
                        width="3rem"
                        height="3rem"
                      />
                    </IconButton>
                  </Dialog.Trigger>
                </motion.div>
              </Flex>
              <AnimatePresence mode="wait">
                {isOpen && (
                  <DialogPrimitive.Content
                    asChild
                    forceMount
                    onOpenAutoFocus={undefined}
                    onCloseAutoFocus={undefined}
                  >
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
                      <Flex
                        direction="column"
                        align="center"
                        width="100%"
                        p="4"
                      >
                        ASDF ASDF ASDF ASDF LOREM IPSUM SMUT DOLLAR ETC
                      </Flex>
                    </motion.div>
                  </DialogPrimitive.Content>
                )}
              </AnimatePresence>
            </motion.div>
          </Flex>
        </Dialog.Root>
      </LayoutGroup>
    </Section>
  );
}
