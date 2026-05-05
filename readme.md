# safer curl sh

## Usage

`pnpm start`




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


strace -f -e trace=%file,%network,%process, ls 2>trace.log

strace strace -f -e trace=%file,%network,%process ls 2>trace.log





## Prochaines étapes

### V1

- [ ] se baser sur strace
  - [ ] créer un parser correct basé sur lezer
- [ ] Afficher une version de rapport strace qui aide à prendre une décision sur si on veut executer un truc ou pas
  - [x] Fichiers ouverts/touchés/lus
  - [ ] Fichiers sur lesquels il y a eu une écriture
    - [ ] suivre quel fd correspond à quel fichier
      - [ ] suivre le mode O_CLOEXEC... ou ptèt pas. Ptèt juste les close, ça suffit
  - [ ] adresses IP contactées
  - [ ] commandes appelées
  - [ ] syscalls non reconnus
  - [ ] embed b3 parce que j'ai dû corriger la grammaire 
- [ ] lancer le process dans bwrap et produire le rapport de syscalls dans un fichier tmp bindé 
- [ ] Mettre dans le readme d'installer lurk ?


## apprentissages 

- strace, c'est relou parce que ça se parse pas bien
- b3 n'est pas ouf https://github.com/dannykopping/b3 parce que j'ai eu des erreurs de parsing sur des cas simples (ls, cat)
- lurk https://github.com/JakWai01/lurk ne comprend pas les fd du syscall `pipe`



### Après

- [ ] afficher les noms de domaine contactés
- [ ] empoisonner certains syscall ?
- [ ] réécrire la production du rapport en Rust en se basant sur sys/ptrace ?
- [ ] utiliser autre chose que bwrap ?




### situation réelles

#### Guix

[Installer guix](https://guix.gnu.org/manual/1.5.0/fr/html_node/Installation-binaire.html)

```
cd /tmp
wget https://guix.gnu.org/guix-install.sh
chmod +x guix-install.sh
./guix-install.sh
```