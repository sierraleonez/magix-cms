import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import React from "react";

interface iPopoverItem<T> {
    title: string;
    value: T;
    onClick: (value: T) => void;
}

type iPopoverItems<T> = Array<iPopoverItem<T>>

export default function MagixPopover<T>({
    children,
    items
}: {
    children: React.ReactElement;
    items: iPopoverItems<T>

}) {
    return (
        <Popover className="relative flex flex-col items-center">
            {({ open, close }) => (
                <>
                    {/* The button that triggers the popover */}
                    <PopoverButton
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}

                    </PopoverButton>

                    {/* The popover panel with a smooth transition */}
                    <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <PopoverPanel className="absolute left-1/2 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-4 sm:px-0">
                            <div className="overflow-hidden rounded-lg shadow-lg">
                                <div className="relative grid gap-8 bg-card p-7">
                                    {items.map((item, index) => (
                                        <div
                                            key={`popover-item-${index}`}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                if (typeof item.onClick === 'function') {
                                                    item.onClick(item.value)
                                                }
                                                close()
                                            }}
                                            className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-slate-50 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50"
                                        >
                                            <p className="text-sm font-medium text-primary">
                                                {item.title}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PopoverPanel>
                    </Transition>
                </>
            )}
        </Popover>

    );
}
