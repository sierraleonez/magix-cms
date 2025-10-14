import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";

export default function DeleteConfirmationDialog({
    isOpen,
    onClickDelete,
    onIsOpenChange,
    isSubmitting,
    title,
    description
}: {
    isOpen: boolean;
    onIsOpenChange: (isOpen: boolean) => void;
    onClickDelete: () => void;
    closeDialog?: () => void;
    isSubmitting?: boolean;
    title: string;
    description: string;
}) {

    return (
        <Dialog open={isOpen} onOpenChange={onIsOpenChange}>
            <DialogContent>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button variant="destructive" disabled={isSubmitting} asChild>
                        <button onClick={onClickDelete}>Delete</button>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}