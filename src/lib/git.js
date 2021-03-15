import {execSync} from 'child_process';
import {trimNewlines} from '@lib/utils'
import {sortByGroup} from '@lib/convention';

/** Get tree-objects of commits separated by tags/version_commits */

export function getHistory(conventional){
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

    commits.forEach( (commit,i) => {
        const match = commit.subject.match(/^(?:v|v\.|v\.\s+)?(\d\.\d\.\d.*)/);
        if(match) {
            tree.addVersion(match[1],commit.date);
            delete commits[i];
        }
    });

    tags.forEach( tag => {
        tree.addVersion(tag.tag,tag.date);
    });

    commits.forEach(commit => tree.addCommit(commit));

    if(conventional) for(let ver in tree.list){
        tree.list[ver].commits = sortByGroup(tree.list[ver].commits);
    }

    if(Object.keys(tree.list['unreleased']).length == 0) delete tree.list['unreleased'];

    return tree.list;
}

/** Get array of the commits from local dir */
export function getLocalCommits(){
    let list = [];
    let raw = git('log','--pretty=format:begin:%H:*:%at:*:%an:*:%B:end','--date=raw');
    const re = /^begin:([\s\S]+?):end$/gm;
    let match;
    while(match = re.exec(raw)){
        const parts = match[1].split(':*:');
        const bodyParts = parts[3].split('\n\n');
        list.push({
            date: Number(parts[1]),
            hash: parts[0],
            author: parts[2],
            subject: trimNewlines(bodyParts[0]),
            body: (bodyParts[1] && trimNewlines(bodyParts[1])) || null,
            footer: (bodyParts[2] && trimNewlines(bodyParts[2])) || null,
            issues: getIssues(parts[3])
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

/** Get repository info */
export function getLocalRepoInfo(){
    const raw = git('remote', 'get-url', 'origin');
    const match = raw.match(/git@(.+?):(.+?)\/(.+?).git/);
    if(!match) return null;
    return{
        type: match[1].replace(/\..+$/,''),
        url: 'https://'+match[1],
        owner: match[2],
        project: match[3],
    }
}

/** Make issue link */
export function makeIssueLink(repo,id){
    return `${repo.url}/${repo.owner}/${repo.project}/issues/${id}`;
}

/** Make commit link */
export function makeCommitLink(repo,hash){
    return `${repo.url}/${repo.owner}/${repo.project}/${repo.type == 'bitbucket' ? 'commits' : 'commit'}/${hash}`;
}


/** Run git command with specified arguments. @return Raw command output */
function git(){
    return execSync('git '+Array.from(arguments).join(' ')).toString('utf-8');
}

/** Get Issues IDs in array */
function getIssues(str){
    const re = /(?:issues\/(\d+)| #(\d+)|^#(\d+))/g;
    const result = [];
    let match;
    while(match = re.exec(str)){
        result.push(match[1] || match[2] || match[3]);
    }
    return [...new Set(result)];
}