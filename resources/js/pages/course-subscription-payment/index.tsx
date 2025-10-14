import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { iCourse } from "@/types";
import { parseErrorMessage } from "@/utils/error";
import { useForm } from "@inertiajs/react";
import { Banknote, Barcode, QrCode, ScanBarcode } from "lucide-react";
import { useMemo } from "react";
import toast from "react-hot-toast";

interface iCourseSubscriptionPaymentProps {
    course: iCourse;
    invitation_id: number;
}

const AVAILABLE_PAYMENT_METHODS = [
    {
        id: 1,
        name: 'Bank Transfer',
        icon: Banknote
    },
    {
        id: 2,
        name: 'QRIS',
        icon: QrCode
    },
]

export default function CourseSubscriptionPayment({ course, invitation_id }: iCourseSubscriptionPaymentProps) {
    const { post, transform } = useForm()
    const subscriptionExpiration = useMemo(() => {
        const currentDate = new Date()
        const month = currentDate.getMonth()
        currentDate.setMonth(month + 1)

        return currentDate.toDateString()
    }, [])

    function paySubscription(paymentMethod: string) {
        transform(() => ({
            amount_payment: course.subscription_price,
            payment_method: paymentMethod,
            invitation_id
        }))
        post(route('storeSubscriptionPayment', {
            course_id: course.id
        }), {
            onSuccess() {
                toast('Course joined!')
            },
            onError(err) {
                const message = parseErrorMessage(err)
                toast(message)
            },
        })
    }

    return (
        <AppLayout>
            <div className="p-3">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Course Subscription Payment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <div className="py-3">
                                <h3 className="font-bold text-md">Subscription Detail</h3>
                                <p>Payment Amount: Rp. {course.subscription_price}</p>
                                <p>Expires At: {subscriptionExpiration}</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-md">Select Payment Method</h3>
                                <div className="flex flex-col gap-y-2 py-2">
                                    {
                                        AVAILABLE_PAYMENT_METHODS.map(method => (
                                            <div
                                                className="flex cursor-pointer gap-x-2 items-center bg-secondary p-2 rounded-md"
                                                key={method.id}
                                                onClick={() => paySubscription(method.name)}
                                            >
                                                <method.icon />
                                                <p>{method.name}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}