//@ts-check
import readline from 'readline'
import { createReadStream } from 'fs'
import { join } from 'path'

// based on TF flag in https://github.com/strace/strace/blob/master/src/linux/64/syscallent.h

const fileSyscallsNames = new Set([
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


const rl = readline.createInterface({
    input: createReadStream(join('./write.lurk.log')),
    output: process.stdout,
    terminal: false
});


const lines = []

/**
 * @param {string} line
 */
function parseLine(line) {
    try {
        let parsed = JSON.parse(line)
        lines.push(parsed)
    } catch (e) {
        // ignore line
    }
}



rl.on('line', parseLine);

rl.on('close', c => {
    console.log('Number of lines:', lines.length)

    const fileSyscalls = lines.filter(l => l.type === 'SYSCALL' && fileSyscallsNames.has(l.syscall))
    const filesNames = new Set(fileSyscalls.map(l => l.args[1]))
    console.log('Files accessed via a file-related syscall:')
    console.log([...filesNames].join('\n'))
})

