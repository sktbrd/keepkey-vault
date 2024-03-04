// Remove the useToast hook from this function
export function handleCopy(value: string, showToast: (message: string) => void): void {
    navigator.clipboard.writeText(value).then(() => {
        // Call the callback function with a success message
        showToast("The wallet address has been copied to your clipboard.");
    }).catch((error) => {
        // Call the callback function with an error message
        showToast("Failed to copy the address.");
    });
}
