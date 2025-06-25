import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface Props {
  open: boolean;
  handleOpen: () => void;
  children: React.ReactNode;
  className?: string;
  showCrossButton?: boolean;
}

function CustomSheet({
  open,
  handleOpen,
  children,
  className,
  showCrossButton,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetTitle className="hidden"></SheetTitle>
      <SheetDescription className="hidden"></SheetDescription>

      <SheetContent
        className={`md:w-[calc(100%-17rem)] w-full !max-w-full  ${className} overflow-y-auto ${
          !showCrossButton ? "[&>button:first-of-type]:hidden " : ""
        } `}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}

export default CustomSheet;
