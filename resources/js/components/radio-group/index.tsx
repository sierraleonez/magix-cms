import { cn } from "@/lib/utils";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "lucide-react";
import { useMemo } from "react";

interface iMagixRadioProps<T> {
    items: Array<T>;
    value: any;
    onChangeValue: (item: T) => void;
    disabled?: boolean;
    itemValueKey?: string;
    itemLabelKey?: string;
    itemClassNameFn?: (item: T) => string;
}

export default function MagixRadio<T>({ items, disabled, onChangeValue, value, itemLabelKey = "label", itemValueKey = "value", itemClassNameFn = () => "" }: iMagixRadioProps<T>) {
    return (
        <RadioGroup by={itemValueKey} value={value} onChange={onChangeValue} aria-label="Server size" className="space-y-2">
            {items.map((item) => (
                <Radio
                    key={`radio-item-${item[itemValueKey]}`}
                    value={item}
                    disabled={disabled}
                    className={cn("group border border-1 relative flex cursor-pointer rounded-lg bg-card/5 px-5 py-4 text-white shadow-md transition focus:not-data-focus:outline-none data-checked:bg-card/10 data-focus:outline data-focus:outline-white", itemClassNameFn(item))}
                >
                    <QuizOptionItem
                        // editable
                        key={`option-${item[itemValueKey]}`}
                        content={item[itemLabelKey]}
                    />
                </Radio>
            ))}
        </RadioGroup>
    )
}

export function QuizOptionItem({ content, editable, onSubmitInput = () => { } }: {
    content: string;
    editable?: boolean;
    onSubmitInput?: (arg: string) => void;
}) {
    return (
        <div id="test-quiz-option" className="flex w-full items-center justify-between">
            <div className="text-sm/6">
                {editable ? (
                    <input
                        className="font-semibold text-primary w-full"
                        defaultValue={content}
                        onBlur={(e) => {

                        }}
                        onKeyDown={(e) => {
                            e.stopPropagation()

                            if (e.key === 'Enter') {
                                const value = e.target.value
                                if (value) {
                                    onSubmitInput(value)
                                    e.target.value = ""
                                }
                            }
                        }}
                    />
                ) : (
                    <p className="font-semibold text-primary">{content}</p>
                )}
                
            </div>
            <CheckCircleIcon className="size-6 fill-primary opacity-0 transition group-data-checked:opacity-100" />
        </div >
    )
}

