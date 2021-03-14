import {getLocalCommits,getLocalTags} from '@lib/git';

export function sayHello(){
    getLocalTags();
}