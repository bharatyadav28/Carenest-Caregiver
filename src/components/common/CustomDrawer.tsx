import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";

interface Props {
  open: boolean;
  handleOpen: () => void;
  children: React.ReactNode;
  className?: string;
}

function CustomDrawer({ open, handleOpen, children, className }: Props) {
  return (
    <Drawer open={open} onOpenChange={handleOpen}>
      <DrawerContent className={`${className}`}>
        <DialogTitle className="hidden"></DialogTitle>
        {children}
      </DrawerContent>
    </Drawer>
  );
}

export default CustomDrawer;
