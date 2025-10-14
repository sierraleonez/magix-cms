import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@headlessui/react";
import { InertiaFormProps } from "@inertiajs/react";
import { iCreateOrganizationFormValue } from "../type/form";
import { FormEventHandler } from "react";

export default function OrganizationForm({ form, onSubmit }: { form: InertiaFormProps<Required<iCreateOrganizationFormValue>>; onSubmit: FormEventHandler }) {
    const { data, setData } = form
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-4">
                <div>
                    <Label>Name</Label>
                    <Input
                        value={data.organization_name}
                        onChange={(e) => setData('organization_name', e.target.value)}
                    />
                </div>
                <div>
                    <Label>Description</Label>
                    <Input
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        multiple
                    />
                </div>
                <div>
                    <Label>Is Public Organization?</Label>
                    <Switch
                        checked={data.is_public}
                        onChange={(val) => setData('is_public', val)}
                        className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-primary/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-chart-5/10 data-focus:outline data-focus:outline-primary"
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-primary shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
                        />
                    </Switch>
                </div>
                <Button type="submit">
                    <p>Create</p>
                </Button>
            </div>
        </form>
    )
}