# Tests

```
strace -f -e trace=%file,%network,%process,%desc,%ipc ls 2>ls.log
```

```
strace -f -e trace=%file,%network,%process,%desc,%ipc tests/write.sh 2>write.log
```

