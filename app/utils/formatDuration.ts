export const formatDuration = (millis: number) => {
    const date = new Date(millis);
    let minutes = `${date.getMinutes()}`
    let seconds = `${date.getSeconds()}`

    if(date.getMinutes() < 10) minutes = "0" + minutes
    if(date.getSeconds() < 10) seconds = "0" + seconds

    return `${minutes}:${seconds}`
}