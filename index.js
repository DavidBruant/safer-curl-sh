//@ts-check
import readline from 'readline'
import { createReadStream } from 'fs'
import { join } from 'path'

import parser from 'b3-strace-parser/lib/parser.js'
import errors from 'b3-strace-parser/lib/errors.js'

// based on TF flag in https://github.com/strace/strace/blob/master/src/linux/64/syscallent.h

const fileSyscalls = new Set([
    "lsetxattr",
    "getxattr",
    "lgetxattr",
    "listxattr",
    "llistxattr",
    "removexattr",
    "lremovexattr",
    "getcwd",
    "inotify_add_watch",
    "mknodat",
    "mkdirat",
    "unlinkat",
    "symlinkat",
    "linkat",
    "renameat",
    "umount2",
    "mount",
    "pivot_root",
    "statfs",
    "fstatfs",
    "truncate",
    "faccessat",
    "chdir",
    "chroot",
    "fchmodat",
    "fchownat",
    "openat",
    "quotactl",
    "readlinkat",
    "newfstatat",
    "fstat",
    "utimensat",
    "acct",
    "execve",
    "swapon",
    "swapoff",
    "fanotify_mark",
    "name_to_handle_at",
    "renameat2",
    "execveat",
    "statx",
])



//parser.initialize({trace: true});
parser.initialize();

const rl = readline.createInterface({
    input: createReadStream(join('./write.log')),
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

    const openatSyscalls = lines.filter(l => l.type === 'SYSCALL' && fileSyscalls.has(l.syscall))
    const filesOpenat = new Set(openatSyscalls.map(l => l.args[1]))
    console.log('Files accessed via a file-related syscall:')
    console.log([...filesOpenat].join('\n'))
})

