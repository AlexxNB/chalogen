import {execSync} from 'child_process';
import {trimNewlines} from '@lib/utils'

/** Get array of the commits from local dir */
export function getLocalCommits(){
    let list = [];
    let raw = git('log','--pretty=format:begin:%ad:*:%an:*:%s:*:%b:end','--date=raw');
    const re = /^begin:([\s\S]+?):end$/gm;
    let match;
    while(match = re.exec(raw)){
        const parts = match[1].split(':*:');
        list.push({
            date: Number(parts[0].split(' ')[0]),
            author: parts[1],
            subject: trimNewlines(parts[2]),
            body: trimNewlines(parts[3]) || null
        })
    }
    return list;
}

/** Get array of the tags from local dir */
export function getLocalTags(){
    let raw = git('log','--tags');
    console.log(raw)
}

/** Run git command with specified arguments. @return Raw command output */
function git(){
    return execSync('git '+Array.from(arguments).join(' ')).toString('utf-8');
}
