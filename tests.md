# Tests

```
strace -f -e trace=%file,%network,%process ls 2>ls.log
```

```
strace -f -e trace=%file,%network,%process touch /tmp/yo.txt 2>touch.log
```