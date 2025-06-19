import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  handleOpen: () => void;
  children: React.ReactNode;
  showCrossButton?: boolean;
  className?: string;
}
export function CustomDialog({
  open,
  handleOpen,
  children,
  className,
  showCrossButton,
}: Props) {
  let classes = `max-w-full  !min-w-[20rem] w-max w-[10rem] min-h-[10rem] !bg-[#fff] !rounded-3xl max-h-[calc(100%-3rem)] py-4 pb-0 ${
    !showCrossButton ? "[&>button:first-of-type]:hidden " : ""
  } `;
  if (className) {
    classes += " " + className;
  }
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className={classes}>
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>

        <div className="flex flex-col h-full overflow-y-auto hide-scrollbar">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DialogIconProps {
  icon: React.JSX.Element;
}
export function DialogIcon({ icon }: DialogIconProps) {
  return (
    <div className="p-5 mb-4 w-max rounded-full bg-[#F2A3071A]">{icon}</div>
  );
}
