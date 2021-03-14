#!/usr/bin/env node
import sade from 'sade';
import {sayHello} from 'changeloger';
import pkg from 'package';

const cli = sade('changeloger',true)

cli.version(pkg.version);

cli.action(()=>{
    sayHello();
})

cli.parse(process.argv);