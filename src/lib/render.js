import c from '@lib/colors';
import {makeIssueLink} from '@lib/git';
import {getDate} from '@lib/utils';
import {getTypeName} from '@lib/convention';
import {parseEmojies} from '@lib/emoji';

const l = console.log;

export function renderCli(options){
    l(c.bold(options.title));
    l();
    for(let tag in options.history){
        if( !options.showUnreleased && tag == 'unreleased' ) continue;

        const ver = options.history[tag];

        l(`${c.yellow(tag)}${ver.date ? c.gray(` - `+getDate(ver.date,options.dateFormat)) : ''}`);
        for(let type of options.showTypes){
            if(!ver.commits[type]) continue;
            l(' ',`${c.bold(c.green(getTypeName(type)))}:`);
            for(let commit of ver.commits[type]){
                const namespace = commit.namespace ? c.bold(commit.namespace+': ') : '';
                const message = parseEmojies(cleanCliLinks(commit.subject));
                const body = commit.body && c.gray(parseEmojies(cleanCliLinks(commit.body)));
                const issues = commit.issues 
                            && commit.issues.length 
                            && ` (${commit.issues.map(i =>c.link('#'+i,makeIssueLink(options.repo,i))).join(', ')})`;
                
                l('  ',c.green('*'),`${namespace}${message}${issues||''}`);
                if(options.showBody && body) l('    ',body);
            }
        }
    }
}

function cleanCliLinks(str){
    return str.replace(/https?:\/\/.+?\/(?:issues|pull|merge_requests|pull_requests)\/(\d+)(?:\/\S*)?/gi,'#$1')
}