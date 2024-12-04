const colorConfig = {
    primary: "#BF3335",
    "gray.400": '#d8e5e6',
    yellow: '#FBC903'
}

export const getColor = (color: keyof typeof colorConfig) => colorConfig[color]