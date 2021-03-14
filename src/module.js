import {getHistory} from '@lib/git';
import {renderCli} from '@lib/render';

export const default_options = {
    output: false,
    showTypes: ['feat','fix','perf','docs','other'],
    title: 'Changelog',
    dateFormat: '%Y-%M-%D',
    showUnreleased: true
}

export function render(options){

    options = {
        ...default_options,
        ...(options || {})
    }

    const history = getHistory(true);

    if(!options.output){
        renderCli(history,options);
    }
}
