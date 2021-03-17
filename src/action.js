import core from '@actions/core';
import {render} from 'chalogen';
import fs from 'fs';

try {
  const opts = {
      title: core.getInput('title'),
      list: core.getInput('list'),
      date: core.getInput('date'),
      file: core.getInput('file'),
      version: core.getInput('version'),
      unreleased: core.getInput('unreleased'),
      hideUnreleased: core.getInput('hide-unreleased'),
      hideTitle: core.getInput('hide-title'),
      hideBody: core.getInput('hide-body'),
      output: 'cli'
  }

  console.log('Rendering markdown...');

  //Print changelog in console
  render(makeOptions(opts));

  // Get cahngelog as markdown
  opts.output = 'markdown';
  const body = render(makeOptions(opts));

  core.setOutput('changelog', body);
  
  console.log('Saving to '+opts.file);
  fs.writeFileSync(opts.file,body);
} catch (error) {
  core.setFailed(error.message);
}

function makeOptions(opts){
    return {
        title: opts.title,
        output: opts.output || 'cli',
        showTypes: opts.list.split(','),
        dateFormat: opts.date,
        showUnreleased: opts.hideUnreleased == 'false',
        showBody: opts.hideTitle == 'false',
        showTitle: opts.hideBody == 'false',
        onlyVersion: (opts.version != 'false' && opts.version) || (opts.unreleased != 'false' && 'unreleased'),
    }
}