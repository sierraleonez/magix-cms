import { useState } from "react"
import { Input } from "../ui/input"
import { useForm } from "@inertiajs/react";
import { useSearch } from "@/utils/autosearch";

interface iMagixComboboxProps<T> {
    items: Array<T>;
    itemKey?: string;
    onValueChange?: (val: string) => void;
    onSuggestionClick?: (suggestion: string) => void;
}

interface iMagixComboboxForm {
    input: string;
}

export default function MagixCombobox<T>({
    items,
    itemKey,
    onValueChange = () => {},
    onSuggestionClick = () => {}
}: iMagixComboboxProps<T>) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { data, setData } = useForm<Required<iMagixComboboxForm>>({
        input: ''
    })

    function onItemClick(suggestion: string) {
        setData('input', suggestion)
        onSuggestionClick(suggestion)
        setIsDropdownOpen(false)
    }

    const { search, searchResult, items: axe } = useSearch(items, itemKey)

    return (
        <div className="relative">
            <Input
                value={data.input}
                onFocus={() => {
                    setIsDropdownOpen(true)
                }}
                onChange={e => {
                    const val = e.target.value
                    onValueChange(val)
                    setData('input', (e.target.value))
                    search(val)
                }}
                placeholder="Member Email"
            />
            {
                isDropdownOpen && (
                    <ul className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {searchResult.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => onItemClick(item)}
                                className="px-4 py-2 cursor-pointer hover:bg-muted transition-colors duration-150"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )
            }


        </div>
    )
}