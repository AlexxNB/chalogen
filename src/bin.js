#!/usr/bin/env node
import sade from 'sade';
import fs from 'fs';
import pkg from 'package';
import {render,default_options,addAction} from 'chalogen';

const cli = sade('chalogen');

cli
    .version(pkg.version)
    .option('--title, -t', 'Changelog title',default_options.title)
    .option('--list, -l', 'Conventional types list to include in changelog',default_options.showTypes.join(','))
    .option('--date, -d', 'Date format; use only %Y,%M and %D placeholders',default_options.dateFormat)
    .option('--only, -o', 'Show only specified version')
    .option('--only-unreleased, -u', 'Show only unreleased commits')
    .option('--no-unreleased', 'Hide unreleased section')
    .option('--no-title', 'Hide title of changelog')
    .option('--no-body', 'Hide body of commit\'s messages')
    .option('--merges, -m', 'Parse only merge commits to generate changelog')
    .option('--since, -s', 'Start commit since build the changelog',default_options.since)

cli
    .command('print')
    .describe('Print changelog in terminal')
    .action( opts => {
        render(makeOptions(opts));
    })

cli
    .command('generate [dir]', '', { default:true })
    .describe('Write generated changelog to the file')
    .action( (dir,opts) => {
        opts.output = 'markdown';
        const ms = render(makeOptions(opts));
        fs.writeFileSync(dir || 'CHANGELOG.md',ms)
    })

cli
    .command('action [name]')
    .describe('Add workflow file for Chalogen GitHub Action')
    .action( (dir,opts) => {
        addAction(dir);
    })

cli.parse(process.argv);

function makeOptions(opts){
    return {
        title: opts.title,
        output: opts.output || 'cli',
        showTypes: opts.list.split(','),
        dateFormat: opts.date,
        showUnreleased: !opts['no-unreleased'],
        showBody: !opts['no-body'],
        showTitle: !opts['no-title'],
        onlyMerges: !!opts.merges,
        since: opts.since,
        onlyVersion: (!!opts.only && opts.only) || (opts.u && 'unreleased'),
    }
}