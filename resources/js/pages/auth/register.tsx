import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useMemo } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import MagixDropdown from '@/components/dropdown';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: number;
};

const Roles = [
    {
        label: 'Teacher',
        value: 2
    },
    {
        label: 'Student',
        value: 3
    }
]

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 0,
    });
    const roleLabel = useMemo(() => {
        if (data.role) {
            return Roles.find(e => e.value === data.role)?.label || ""
        } else {
            return ""
        }
    }, [data.role])

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>
                    <MagixDropdown
                        items={Roles}
                        label='Account Type'
                        onItemClick={(item) => setData('role', item.value)}
                        selectedValue={roleLabel}
                        placeholder='Select account type'
                    />
                    {/* <DropdownMenu>
                        <div className="grid gap-2">
                            <Label htmlFor="accountType">Account Type</Label>
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
                                    {data.role ? (
                                        <p>{roleLabel}</p>
                                    ) : (
                                        <p className='color-[#0a0a0a]'>Select your account type</p>
                                    )}
                                </div>
                            </DropdownMenuTrigger>
                            <InputError message={errors.email} />
                        </div>
                        <DropdownMenuContent
                            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0"
                            align="start"
                            style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
                        >
                            {
                                Roles.map((role, idx) => {
                                    return (
                                        <>
                                            <DropdownMenuItem onClick={() => setData('role', role.value)}>
                                                {role.label}
                                            </DropdownMenuItem>
                                            {
                                                (idx % 2 === 0 || idx === 0) && (
                                                    <DropdownMenuSeparator />
                                                )
                                            }
                                        </>
                                    )
                                })
                            }
                        </DropdownMenuContent>
                    </DropdownMenu> */}


                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout >
    );
}
