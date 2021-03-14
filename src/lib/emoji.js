import emoji from 'emoji';

export function parseEmojies(str){
    return str.replace(/:\w+?:/g,code => emoji[code]||'');
}