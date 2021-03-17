import emoji from 'emoji';

/** Return string with emojis codes replaced by unicode symbols */
export function parseEmojies(str){
    return str.replace(/:\w+?:/g,code => emoji[code]||'');
}