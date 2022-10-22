import c from '@lib/colors';
import {makeIssueLink, makeCommitLink, makeMergeLink} from '@lib/git';
import {getDate} from '@lib/utils';
import {getTypeName, normalizeType} from '@lib/convention';
import {parseEmojies} from '@lib/emoji';
import {createDocument} from '@lib/markdown';

const l = console.log;

/** Print changelog in console */
export function renderCli(options){

    if(options.showTitle){
        l(c.bold(options.title));
        l();
    }
    
    if(options.onlyVersion){
        const only = options.history[options.onlyVersion];
        options.history = {};
        if(only) options.history[options.onlyVersion] = only;
    }

    for(let tag in options.history){
        if( !options.showUnreleased && tag == 'unreleased' ) continue;

        const ver = options.history[tag];

        !options.onlyVersion && l(`${c.yellow(tag)}${ver.date ? c.gray(` - `+getDate(ver.date,options.dateFormat)) : ''}`);
        for(let rawType of options.showTypes){
            const type = normalizeType(rawType, true);
            if(!type || !ver.commits[type]) continue;
            l(' ',`${c.bold(c.green(getTypeName(type)))}:`);
            for(let commit of ver.commits[type]){
                const namespace = commit.namespace ? c.bold(commit.namespace+': ') : '';
                const message = parseEmojies(cleanCliLinks(commit.subject));
                const body = commit.body && c.gray(parseEmojies(cleanCliLinks(commit.body)));
                const issues = commit.issues 
                            && commit.issues.length 
                            && ` (${commit.issues.map(i =>c.link('#'+i,makeIssueLink(options.repo,i))).join(', ')})`;
                const link = commit.mergeId 
                    ? c.blue(c.link(`#${commit.mergeId}`,makeMergeLink(options.repo,commit.mergeId)))
                    : c.blue(c.link(commit.hash.substring(0,8),makeCommitLink(options.repo,commit.hash)));
                l('  ',c.green('*'),`${namespace}${message}${issues||''} ${link}`);
                if(options.showBody && body) l('    ',body);
            }
        }
    }
}

/** Return changelog as markdown markup */
export function renderMarkdown(options){
    const changelog = createDocument();

    if(options.showTitle){
        changelog.header(options.title,1,0);
    }
    
    if(options.onlyVersion){
        const only = options.history[options.onlyVersion];
        options.history = {};
        if(only) options.history[options.onlyVersion] = only;
    }

    for(let tag in options.history){
        if( !options.showUnreleased && tag == 'unreleased' ) continue;

        const ver = options.history[tag];

        !options.onlyVersion && changelog.header(`${tag}${ver.date ? ` - `+getDate(ver.date,options.dateFormat) : ''}`,2,0);

        for(let rawType of options.showTypes){
            const type = normalizeType(rawType, true);
            if(!type || !ver.commits[type]) continue;

            changelog.header(getTypeName(type),3,0);
            
            changelog.newline();
            for(let commit of ver.commits[type]){
                const namespace = commit.namespace ? changelog.bold(commit.namespace+':')+' ' : '';
                const message = parseEmojies(cleanMDLinks(commit.subject,changelog));
                const body = commit.body && parseEmojies(cleanMDLinks(commit.body,changelog));
                const issues = commit.issues 
                            && commit.issues.length 
                            && ` (${commit.issues.map(i => changelog.link('#'+i,makeIssueLink(options.repo,i))).join(', ')})`;
                const link = commit.mergeId 
                    ? changelog.link(changelog.code(`#${commit.mergeId}`),makeMergeLink(options.repo,commit.mergeId))
                    : changelog.link(changelog.code(commit.hash.substring(0,8)),makeCommitLink(options.repo,commit.hash));
                
                changelog.list(`${namespace}${message}${issues||''} ${link}`,0);
                if(options.showBody && body) changelog.paragraph(changelog.italic(body),1);
            }
        }
    }

    return changelog.render();
}

/** Replace repository links by CLI links */
function cleanCliLinks(str){
    return str
        .replace(/https?:\/\/.+?\/(?:issues|pull|merge_requests|pull_requests)\/(\d+)(?:\/\S*)?/gi,(match,id)=>{
            return c.link('#'+id, match);
        })
}

/** Replace repository links by markdown links */
function cleanMDLinks(str,doc){
    return str
        .replace(/https?:\/\/.+?\/(?:issues|pull|merge_requests|pull_requests)\/(\d+)(?:\/\S*)?/gi,(match,id)=>{
            return doc.link('#'+id, match);
        })
}