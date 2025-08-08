import { Toast } from "radix-ui";
import { useEffect, useRef, useState } from "react";
import useSlimeStore from "./stores/useSlimeStore";

export default function ToastProvider() {
  const toastState = useSlimeStore((state) => state.toast);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (toastState.lastTriggeredAt === 0) return;
    setOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 100);
  }, [toastState.lastTriggeredAt]);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut grid grid-cols-[auto_max-content] items-center gap-x-[15px] bg-zinc-800/45 p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="text-slate12 mb-[5px] text-[15px] font-medium [grid-area:_title]">
          {/* TODO: Add icon based on toastState.type */}
          {toastState.title}
        </Toast.Title>
        <Toast.Description asChild>
          <p className="text-slate11 text-[13px] leading-normal [grid-area:_description]">
            {toastState.description}
          </p>
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="fixed right-0 bottom-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
}
