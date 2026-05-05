# Tests

```
strace -o ls.log --no-abbrev --follow-forks --string-limit=100 -e trace=%file,%network,%process,%desc,%ipc ls
```

```
strace -o write.log --no-abbrev --follow-forks --string-limit=100 -e trace=%file,%network,%process,%desc,%ipc tests/write.sh
```
