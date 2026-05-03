# safer curl sh

## Usage

pnpx url-to

npx


open a shell with bwrap

```sh
bwrap \
  --ro-bind /lib /lib \
  --ro-bind /bin /bin \
  --ro-bind /lib64 /lib64 \
  --ro-bind /usr /usr \
  --ro-bind /etc /etc \
  --tmpfs /tmp \
  --tmpfs /home \
  --unshare-pid \
  --unshare-ipc \
  --unshare-uts \
  --clearenv \
  --setenv PATH "$PATH" \
  --proc /proc \
  --dev /dev \
  sh
```

This shell is extremely similar to the host system shell, but very isolated from it

In this shell, do the curl sh

```sh
strace -f -e trace=%file,%network,%process curl {url} | sh 2>trace.log
```


--verbose=all --no-abbrev --string-limit=200


strace -f -e trace=%file,%network,%process ls 2>trace.log

strace strace -f -e trace=%file,%network,%process ls 2>trace.log





## Prochaines étapes

- [ ] récupérer la trace d'un process lancé dans bwrap + strace
- [ ] la parser pour avoir une version structurée de l'activité
    s'aider de https://github.com/dannykopping/b3
- [ ] Afficher une version agréable de rapport strace

### situation réelles

#### Guix

[Installer guix](https://guix.gnu.org/manual/1.5.0/fr/html_node/Installation-binaire.html)

```
cd /tmp
wget https://guix.gnu.org/guix-install.sh
chmod +x guix-install.sh
./guix-install.sh
```