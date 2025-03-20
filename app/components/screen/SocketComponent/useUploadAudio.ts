import { useMutation } from "@tanstack/react-query"
import { AudioService } from "app/services/audio.service"
import { removeSitesFromTitle } from "app/utils/removeSitesFromTitle"
import { useCallback, useMemo, useState } from "react"

export const useUploadAudio = (onChange: React.Dispatch<React.SetStateAction<string>>) => {
    const [isLoading, setIsLoading] = useState(false)

    const { mutateAsync } = useMutation({
        mutationFn: ({ data, folder }: { data: FormData, folder: string }) => AudioService.upload(data, folder),
        mutationKey: ["upload file"]
    })


    const uploadFile = useCallback(async (songUri: string, folder: string) => {
        setIsLoading(true)

        const fileName = songUri?.split('/').pop() || ''

        const match = /\.(\w+)$/.exec(fileName)
        const type = match ? `audio/${match[1]}` : 'audio'

        const formData = new FormData()

        const name = removeSitesFromTitle(fileName)

        formData.append('file', {
            uri: songUri,
            type,
            name
            // name: removeSitesFromTitle(fileName) + fileName.slice(fileName.lastIndexOf('.'))
        } as unknown as Blob)


        
        const ans = await mutateAsync({
            data: formData,
            folder
        })
        
        
        if(ans.status === 200) {
            onChange(`/uploads/${folder}/${name}`)
        }


        setTimeout(() => {
            setIsLoading(false)
        }, 1000)

    }, [mutateAsync])




    return useMemo(() => ({
        isLoading, uploadFile
    }), [isLoading, uploadFile])
}