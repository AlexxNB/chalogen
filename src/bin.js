#!/usr/bin/env node
import sade from 'sade';
import {sayHello} from 'chlogen';
import pkg from 'package';

const cli = sade('chlogen',true)

cli.version(pkg.version);

cli.action(()=>{
    sayHello();
})

cli.parse(process.argv);