export function parseErrorMessage(err: { [key: string]: string }) {
  const val = Object.values(err)
  if (val.length > 0) {
    const firstError = val?.[0]
    const isMoreThanOneError = val.length > 1;
    const additionalErrorMessage = `And ${val.length} more errors.`
    return `${firstError} ${isMoreThanOneError ? additionalErrorMessage : ""}`
  }
  return ""
}