export function trimNewlines(str){
    return str
        .replace(/\n/g,' ')
        .replace(/\s+/g,' ')
        .replace(/^\s|\s$/g,'')
}