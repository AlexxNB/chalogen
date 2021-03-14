import {execSync} from 'child_process';
import {trimNewlines} from '@lib/utils'

/** Get tree-objects of commits separated by tags/version_commits */

export function getHistory(){
    const commits = getLocalCommits();
    const tags = getLocalTags();

    const tree = {
        list: {},
        addVersion(version,date){
            this.list[version]={
                date: date||null,
                commits: []
            }
        },
        addCommit(commit){
            let obj = Object.entries(this.list)
                .sort((a,b) =>{
                    if(a[1].date === null) return -1;
                    if(b[1].date === null) return 1;
                    return b[1].date-a[1].date;
                })
                .reduce((o,[name,tag])=>{
                    return (tag.date||Infinity) >= commit.date ? tag : o;
                },null);
            obj && obj.commits.push(commit);
        }
    }

    tree.addVersion('unreleased',null);

    commits.forEach( commit => {
        const match = commit.subject.match(/^(?:v|v\.|v\.\s+)?(\d\.\d\.\d.*)/);
        if(match) tree.addVersion(match[1],commit.date);
    });

    tags.forEach( tag => {
        tree.addVersion(tag.tag,tag.date);
    });

    commits.forEach(commit => tree.addCommit(commit));

    return tree.list;
}

/** Get array of the commits from local dir */
export function getLocalCommits(){
    let list = [];
    let raw = git('log','--pretty=format:begin:%at:*:%an:*:%s:*:%b:end','--date=raw');
    const re = /^begin:([\s\S]+?):end$/gm;
    let match;
    while(match = re.exec(raw)){
        const parts = match[1].split(':*:');
        list.push({
            date: Number(parts[0]),
            author: parts[1],
            subject: trimNewlines(parts[2]),
            body: trimNewlines(parts[3]) || null
        })
    }
    return list;
}

/** Get array of the tags from local dir */
export function getLocalTags(){
    let list = [];
    let raw = git('log','--tags', '--simplify-by-decoration', '--pretty="format:begin:%at:*:%D:end"');
    const re = /^begin:([\s\S]+?):end$/gm;
    let match;
    while(match = re.exec(raw)){
        const parts = match[1].split(':*:');
        const sub = parts[1].match(/tag:\s+(?:v|v\.|v\.\s+)?(\d.+?),/);
        sub && list.push({
            date: Number(parts[0]),
            tag: trimNewlines(sub[1]),
        })
    }
    return list;
}

/** Run git command with specified arguments. @return Raw command output */
function git(){
    return execSync('git '+Array.from(arguments).join(' ')).toString('utf-8');
}
