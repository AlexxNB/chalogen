import c from '@lib/colors';
import {getDate} from '@lib/utils';
import {getTypeName} from '@lib/convention';
import {parseEmojies} from '@lib/emoji';

const l = console.log;

export function renderCli(history,options){
    l(c.bold(options.title));
    l();
    for(let tag in history){
        if( !options.showUnreleased && tag == 'unreleased' ) continue;

        const ver = history[tag];

        l(`${c.yellow(tag)}${ver.date ? c.gray(` - `+getDate(ver.date,options.dateFormat)) : ''}`);
        for(let type of options.showTypes){
            if(!ver.commits[type]) continue;
            l(' ',`${c.bold(c.green(getTypeName(type)))}:`);
            for(let commit of ver.commits[type]){
                l('  ',`${commit.namespace ? c.bold(commit.namespace+': ') : ''}${parseEmojies(commit.subject)}`)
            }
        }
    }
}