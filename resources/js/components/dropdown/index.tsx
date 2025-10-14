import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Label } from "../ui/label"
import InputError from "../input-error";

interface iDropdownItem {
    label: string;
    value: any;
}

interface iMagixDropdownProps {
    items: Array<iDropdownItem>;
    label: string;
    selectedValue: string;
    onItemClick: (item: iDropdownItem) => void;
    placeholder?: string;
    error?: string;
}

export default function MagixDropdown({
    items,
    label,
    onItemClick,
    selectedValue,
    placeholder,
    error
}: iMagixDropdownProps) {
    return (
        <DropdownMenu>
            <div className="grid gap-2">
                <Label htmlFor="accountType">{label}</Label>
                <DropdownMenuTrigger asChild>
                    <div
                        className={cn(
                            "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                            "items-center"
                        )}
                        tabIndex={0}
                    >
                        {selectedValue ? (
                            <p>{selectedValue}</p>
                        ) : (
                            <p className='color-[#0a0a0a]'>{placeholder}</p>
                        )}
                    </div>
                </DropdownMenuTrigger>
                <InputError message={error} />
            </div>
            <DropdownMenuContent
                className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0"
                align="start"
                style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
            >
                {
                    items.map((item, idx) => {
                        return (
                            <>
                                <DropdownMenuItem onClick={() => onItemClick(item)}>
                                    {item.label}
                                </DropdownMenuItem>
                                {/* {
                                    ((idx + 1) % 2 === 0) && (
                                        <DropdownMenuSeparator />
                                    )
                                } */}
                            </>
                        )
                    })
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}