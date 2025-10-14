import { PenBoxIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";

interface iTableToolboxProps {
    onClickDelete: () => void;
    onClickEdit: () => void;
}

export default function TableToolbox({
    onClickDelete = () => { },
    onClickEdit = () => { }
}: iTableToolboxProps) {
    return (
        <div className="flex gap-x-3" >
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    onClickEdit()
                }}
            >
                <PenBoxIcon />
            </Button>
            <Button
                onClick={(e) => {
                    e.stopPropagation()
                    onClickDelete()
                }}
                variant={"destructive"}
            >
                <TrashIcon />
            </Button>
        </div>
    )
}