//@ts-check
import readline from 'readline'
import { createReadStream } from 'fs'
import { join } from 'path'


/**
 * @typedef LurkSyscallLine 
 * @prop {'SYSCALL'} type
 * @prop {number} pid
 * @prop {number} num
 * @prop {string} syscall
 * @prop {(number | string)[]} args 
 * @prop {any} [success]
 * @prop {any} [error] 
 * @prop {number} duration  
 * 
 */




// based on TF flag in https://github.com/strace/strace/blob/master/src/linux/64/syscallent.h

const fileSyscallsNames = new Set([
    "lsetxattr",
    "getxattr",
    "lgetxattr",
    "listxattr",
    "llistxattr",
    "removexattr",
    "lremovexattr",
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
    "utimensat",
    "acct",
    "swapon",
    "swapoff",
    "fanotify_mark",
    "name_to_handle_at",
    "renameat2",
    "statx",
])


const rl = readline.createInterface({
    input: createReadStream(join('./write.lurk.log')),
    output: process.stdout,
    terminal: false
});

/** @type {LurkSyscallLine[]} */
const lines = []

/**
 * @param {string} line
 */
function parseLine(line) {
    try {
        /** @type {LurkSyscallLine} */
        let parsed = JSON.parse(line)
        lines.push(parsed)
    } catch (e) {
        // ignore line
    }
}

// -100 is dirfd special value for AT_FDCWD
// https://github.com/torvalds/linux/blob/c7e4e4d5f7dc2daa439303d1b5bf6bdfaa249f49/include/uapi/linux/fcntl.h#L106


/*
options for file open

https://github.com/torvalds/linux/blob/c7e4e4d5f7dc2daa439303d1b5bf6bdfaa249f49/include/uapi/asm-generic/fcntl.h#L18-L95
*/

/**
 * 
 * @param {LurkSyscallLine} l 
 */
function findFilenameArg(l){
    switch(l.syscall){
        case 'statfs': {
            return l.args[0]
        }
        case 'openat': 
        case 'newfstatat':
        case 'statx': {
            return l.args[1]
        }
        default:{
            throw new TypeError(`Unknown syscall for findFilenameArg: ${l.syscall}.\nLine : ${JSON.stringify(l, null, 2)}`)
        }
    }
}



rl.on('line', parseLine);

rl.on('close', c => {
    console.log('Number of lines:', lines.length)

    const fileSyscalls = lines.filter(l => l.type === 'SYSCALL' && fileSyscallsNames.has(l.syscall))
    console.log('fileSyscalls', fileSyscalls)
    const filesNames = new Set(fileSyscalls.map(findFilenameArg))
    console.log('Files accessed via a file-related syscall:')
    console.log([...filesNames].join('\n'))
})

