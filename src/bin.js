#!/usr/bin/env node
import sade from 'sade';
import {render,default_options} from 'chlogen';
import pkg from 'package';

const cli = sade('chlogen');

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

cli
    .command('print')
    .describe('Print changelog in terminal')
    .action( opts => {
        render({
            title: opts.title,
            showTypes: opts.list.split(','),
            dateFormat: opts.date,
            showUnreleased: opts.unreleased !== false,
            showBody: opts.body !== false,
            showTitle: opts.title !== false,
            onlyVersion: (!!opts.only && opts.only) || (opts.u && 'unreleased'),
        });
    })

cli.parse(process.argv);