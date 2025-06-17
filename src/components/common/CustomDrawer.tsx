import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";

interface Props {
  open: boolean;
  handleOpen: () => void;
  children: React.ReactNode;
  className?: string;
  direction?: "top" | "bottom" | "left" | "right";
}

function CustomDrawer({
  open,
  handleOpen,
  children,
  className,
  direction,
}: Props) {
  return (
    <Drawer
      open={open}
      onOpenChange={handleOpen}
      direction={direction ? direction : "bottom"}
    >
      <DrawerContent className={`${className}`}>
        <DialogTitle className="hidden"></DialogTitle>
        {children}
      </DrawerContent>
    </Drawer>
  );
}

export default CustomDrawer;
