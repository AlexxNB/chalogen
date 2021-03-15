import {getHistory,getLocalRepoInfo} from '@lib/git';
import {renderCli} from '@lib/render';

export const default_options = {
    output: false,
    showTypes: ['feat','fix','perf','docs','other'],
    title: 'Changelog',
    dateFormat: '%Y-%M-%D',
    showUnreleased: true,
    showBody: true,
    showTitle: true,
    onlyVersion: null
}

export function render(options){

    options = {
        ...default_options,
        ...(options || {}),
        history: getHistory(true),
        repo: getLocalRepoInfo()
    }

    if(!options.output){
        renderCli(options);
    }
}
