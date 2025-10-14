export function resetField(id: string) {
    const element = document.getElementById(id) as HTMLInputElement
    if (element) {
        element.value = ""
    }
}