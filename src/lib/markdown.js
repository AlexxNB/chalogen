/** Methods to form markdown document */
export function createDocument(){
    let body = '';

    const repeat = (str,num)=>num && str.repeat(num) || '';
    const shift = level => repeat('    ',level);

    return {
        header(str,level, ident){
            body += `\n\n${shift(ident)}${repeat('#',level)} ${str}`
        },
        list(str,ident){
            body += `\n${shift(ident)}${ident % 2 ? '*' : '-'} ${str}`;
        },
        line(str,ident){
            body += `\n${shift(ident)}${str}`;
        },
        newline(){
            body += `\n`;
        },
        paragraph(str,ident){
            this.newline();
            this.line(str,ident);
        },
        hr(){
            this.line('---');
        },
        link(text,url){
            return `[${text}](${url})`
        },
        bold(str){
            return `**${str}**`
        },
        italic(str){
            return `*${str}*`
        },
        code(str){
            return `\`${str}\``
        },
        render(){
            return body.replace(/^\s+|\s+$/g,'');
        }

    }
}