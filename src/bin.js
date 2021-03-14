#!/usr/bin/env node
import sade from 'sade';
import {render} from 'chlogen';
import pkg from 'package';

const cli = sade('chlogen',true)

cli.version(pkg.version);

cli.action(()=>{
    render();
})

cli.parse(process.argv);