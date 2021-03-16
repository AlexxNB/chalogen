import {getHistory,getLocalRepoInfo} from '@lib/git';
import {renderCli,renderMarkdown} from '@lib/render';

export {addAction} from '@lib/action';

export const default_options = {
    output: 'cli',
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

    if(!options.output || options.output == 'markdown'){
        return renderMarkdown(options);
    }

    if(options.output == 'cli'){
        renderCli(options);
    }
}
