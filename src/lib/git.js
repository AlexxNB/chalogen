import {execSync} from 'child_process';
import {trimNewlines} from '@lib/utils'
import {sortByGroup} from '@lib/convention';

/** Get tree-objects of commits separated by tags/version_commits */

export function getHistory(conventional, mergesOnly, since){
    let commits = getLocalCommits(since);
    const versions = getLocalTags(since);

    if (mergesOnly) {
        commits = commits
            .filter((commit) => 
                commit.subject.startsWith('Merge') 
                && commit.body
            )
            .map((commit) => {
                const mergeId = retrieveMergeId(commit.footer);
                commit.subject = commit.body;
                commit.body = null;
                if (mergeId) commit.mergeId = mergeId;
                return commit;
            });
    }

    versions.unshift({date: Math.floor(new Date().getTime() / 1000), tag:'unreleased'});

    const tree = versions.reduce((o, ver) => {
        o[ver.tag] = {
            date: ver.date,
            commits: [],
        }
        return o;
    }, {});

    versions.reverse();
    const reVersion = /(?:v\.)?\d\.\d.+$/;
    for( let commit of commits) {
        if(
            reVersion.test(commit.subject) 
            || commit.subject.startsWith('Merge')
            || commit.subject.startsWith('# Conflicts:')
        ) continue;
        const version = versions.find((ver) => ver.date >= commit.date);
        tree[version.tag].commits.push(commit);
    }

    if(conventional) for(let ver in tree){
        tree[ver].commits = sortByGroup(tree[ver].commits);
    }


    if(tree['unreleased'].commits.length == 0) {
        delete tree['unreleased'];
    } else {
        delete tree['unreleased'].date;
    }
    
    return tree;
}

/** Get array of the commits from local dir */
export function getLocalCommits(since) {
    const params = [
        'log',
        '--pretty=format:begin:%H:*:%at:*:%an:*:%B:end',
        '--date=raw',
    ];
    if (since) {
        params.push(`${since}^..HEAD`);
    }
    let raw = git(...params);
    const re = /^begin:([\s\S]+?):end$/gm;

    let list = [];
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
export function getLocalTags(since){
    const params = [
        'log',
        '--tags',
        '--simplify-by-decoration',
        '--pretty="format:begin:%at:*:%D:end"',
    ];
    if (since) {
        params.push(`${since}^..HEAD`);
    }
    let raw = git(...params);
    let list = [];
    const re = /^begin:([\s\S]+?):end$/gm;
    let match;
    while(match = re.exec(raw)){
        const parts = match[1].split(':*:');
        const sub = parts[1].match(/tag:\s+(?:v|v\.|v\.\s+)?(\d.+)$/);
        sub && list.push({
            date: Number(parts[0]),
            tag: trimNewlines(sub[1]),
        })
    }
    return list.sort((a,b) => b.date - a.date);
}

/** Get repository info */
export function getLocalRepoInfo(){
    const raw = git('config', '--get', 'remote.origin.url');
    let match = raw.match(/git@(.+?):(.+?)\/(.+?).git/);
    if(!match) {
        match = raw.match(/https?:\/\/(.+?)\/(.+?)\/(.+)/);
    }
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

/** Make merge link */
export function makeMergeLink(repo,id){
    const merge = repo.type == 'github' 
        ? 'pull' 
        : repo.type == 'gitlab' 
            ? 'merge_requests'
            : 'pull-requests';
    return `${repo.url}/${repo.owner}/${repo.project}/${merge}/${id}`;
}

/** Make commit link */
export function makeCommitLink(repo,hash){
    return `${repo.url}/${repo.owner}/${repo.project}/${repo.type == 'bitbucket' ? 'commits' : 'commit'}/${hash}`;
}


/** Run git command with specified arguments. @return Raw command output */
function git(){
    try{
        return execSync('git '+Array.from(arguments).join(' ')).toString('utf-8');
    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
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

/** Retrieve merge request ID */
function retrieveMergeId(body) {
    const match = body && body.match(/^See merge request .+!(\d+)$/)
    return match ? match[1] : null;
}