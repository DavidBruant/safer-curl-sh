//@ts-check
import readline from 'readline'
import {createReadStream} from 'fs'
import {join} from 'path'

import parser from 'b3-strace-parser/lib/parser.js'
import errors from 'b3-strace-parser/lib/errors.js'


//parser.initialize({trace: true});
parser.initialize();

const rl = readline.createInterface({
    input: createReadStream(join('./trace.log')),
    output: process.stdout,
    terminal: false
});


const lines = []

/**
 * @param {string} line
 */
function parseLine(line) {
    try {
        let parsed = parser.parseLine(line);
        lines.push(parsed)
    } catch (e) {
        switch (true) {
            case e instanceof errors.UnfinishedSyscallException:
                console.warn('Encountered partial syscall, skipping: ' + line);
                // suppress
                return;
        }


        console.error('[PARSE ERROR]', e);
        console.error('Exiting due to stopOnFail argument');
        process.exit(1);
    }
}



rl.on('line', parseLine);

rl.on('close', c => {
    console.log('Number of lines:', lines.length)
    
    const openatSyscalls = lines.filter(l => l.type === 'SYSCALL' && l.syscall === 'openat')
    const filesOpenat = new Set(openatSyscalls.map(l => l.args[1]))
    console.log('Files accessed via openat syscall:')
    console.log([...filesOpenat].join('\n'))
})


// TODO: some kind of buffering solution to boost performance?
/**
 * @param {any} line
 */
function outputLine(line) {
    return JSON.stringify(line);
}