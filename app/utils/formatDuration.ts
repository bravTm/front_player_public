export const formatDuration = (millis: number) => {
    const date = new Date(millis);
    return `${date.getMinutes()}:${date.getSeconds()}`
}