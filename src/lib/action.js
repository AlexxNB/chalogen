import fs from 'fs';
import path from 'path';

const DIR = path.join('.github','workflows');

/** Place chalogen workflow file in directory in the project */
export function addAction(filename){
    filename = (filename || 'generate_changelog')+'.yml';
    let filepath = path.join(DIR,filename);

    if(fs.existsSync(filepath)) {
        console.log(`Action file with name ${filename} already exists`);
        process.exit(1);
    }

    fs.mkdirSync(DIR,{recursive: true});
    fs.writeFileSync(filepath,getActionBody());
}

/** Get workflow yml-code */
function getActionBody(){
    return `name: Generate Changelog

on:
  push:
    branches: [ main, master]

jobs:
  changelog:
    name: Update Changelog
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Update Changelog
        uses: AlexxNB/chalogen@master
        with:
          title: My project changelog 
      - name: Commit Changelog to repository
        uses: stefanzweifel/git-auto-commit-action@v4.13.0
        with:
          commit_message: 'docs(Changelog): Update Changelog'
          file_pattern: CHANGELOG.md`
}