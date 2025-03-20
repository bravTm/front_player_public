import { SERVER_URL } from "app/config/api.config"

export const AudioService = {
    async upload(file: FormData, folder?: string){
        // return instance.post("files", file, {
        //     headers: { 'Content-Type': 'multipart/form-data' },
        //     params: { folder }
        // })

        return fetch(SERVER_URL + "files?" + new URLSearchParams({ folder: folder || "" }).toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: file,
        })
    }
}