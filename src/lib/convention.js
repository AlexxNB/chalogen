const TYPES = {
    "Features": ['feature', 'feat', 'add', 'new'],
    "Bug Fixes": ['fix', 'bug'],
    "Documentation": ['docs', 'doc', 'documentation', 'readme'],
    "Styles": ['style'],
    "Code Refactoring": ['refactor', 'refact', 'ref'],
    "Performance Improvements": ['perf', 'performance', 'speedup', 'enchancement'],
    "Tests": ['test', 'tests'],
    "Builds": ['build'],
    "Continuous Integrations": ['ci', 'deploy'],
    "Chores": ['chore', 'chores'],
    "Reverts": ['revert', 'rollback'],
    "Other": ['other'],
}

/** return type name by its type identificator */
export function getTypeName(code){
    return Object.keys(TYPES).find((key)=>TYPES[key].includes(code)) || 'Unknown type';
}

/** return type code by one of its variant */
export function normalizeType(code, exact){
    const codes = Object.values(TYPES).find((value)=>value.includes(code));
    return (codes && codes[0]) || (exact ? null : 'other');
}

/** Gets commits array and return object of groups by types */
export function sortByGroup(commits){
    return commits.reduce((result,commit) => {
        const match = commit.subject.match(/^(?:(\w+?)(?:\((.*?)\))?:\s*)?(.+)$/);

        if(!match) return result;

        const type = normalizeType(match[1]);

        if(type == 'docs' && match[2] == 'Changelog') return result;

        if(!result[type]) result[type] = [];
        result[type].push({
            ...commit,
            subject: match[3],
            namespace:  match[2] || null
        })
        return result;
    },{});
}