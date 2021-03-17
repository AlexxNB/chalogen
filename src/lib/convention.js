const TYPES = {
    feat: "Features",
    fix: "Bug Fixes",
    docs: "Documentation",
    style: "Styles",
    refactor: "Code Refactoring",
    perf: "Performance Improvements",
    test: "Tests",
    build: "Builds",
    ci: "Continuous Integrations",
    chore: "Chores",
    revert: "Reverts"
}

/** return type name by its type identificator */
export function getTypeName(code){
    if(code == 'other') return 'Other';
    return TYPES[code] || 'Unknown type';
}

/** Gets commits array and return object of groups by types */
export function sortByGroup(commits){
    return commits.reduce((result,commit) => {
        const match = commit.subject.match(/^(?:(\w+?)(?:\((.*?)\))?:\s*)?(.+)$/);

        if(!match) return result;

        const type = (match[1] && TYPES[match[1]] && match[1]) || 'other';

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