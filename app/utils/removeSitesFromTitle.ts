export const removeSitesFromTitle = (title: string) => {
    const sites = ['.com', '.ru', '.org', '.ру', '.net', '.cc', '.me', '.bio', '.one', '.io']
    let have
    let copy = title.toLowerCase()
    
    for(let i = 0; i < sites.length; i++) {
        if(copy.includes(sites[i])) {
            have = copy.indexOf(sites[i])
            break;
        }
    }

    if(!have) return title


    // ищу индексы скобок ()
    let firstIdx = title.slice(0, have).lastIndexOf("(")

    if(firstIdx == -1) return title
    return title.slice(0, firstIdx)
}