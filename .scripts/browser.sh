#!/bin/sh

open="chromium --enable-logging=stderr --log-level=3 --incognito --app=$1"

[ $(type -P prime-run) ] && prime-run $open || $open
