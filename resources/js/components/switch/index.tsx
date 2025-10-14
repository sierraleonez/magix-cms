import { Switch } from "@headlessui/react";

interface iMagixSwitchProps {
    isChecked: boolean;
    setIsChecked: (val: boolean) => void;
}

export default function MagixSwitch({ isChecked, setIsChecked }: iMagixSwitchProps) {
    return (
        <Switch
            checked={isChecked}
            onChange={setIsChecked}
            className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-primary/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-chart-5/10 data-focus:outline data-focus:outline-primary"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-primary shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
            />
        </Switch>
    )
}