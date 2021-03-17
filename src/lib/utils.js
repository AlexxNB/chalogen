/** Trim all spaces to one, remove spaces at start and end */
export function trimNewlines(str){
    return str
        .replace(/\n/g,' ')
        .replace(/\s+/g,' ')
        .replace(/^\s|\s$/g,'')
}

/** Format unix-timestamp to date string */
export function getDate(timestamp,format){
    format = format || '%Y-%M-%D'

    const leading = (num) => num < 10 ? '0'+num : num;
    const date = new Date(timestamp * 1000);

    const y = date.getFullYear();
    const m = date.getMonth()+1;
    const d = date.getDate();
    
    return format
      .replace(/%Y/g,y)
      .replace(/%M/g,leading(m))
      .replace(/%D/g,leading(d))
  }