# bdump

Dumps information about current open tabs or bookmarks.

## Others Browsers

Tested with `Firefox`.

As far as I know, this should work on any other `modern` browser, but `chrome`.
`Google Chrome` uses `chrome` instead of `browser` for the extension global
object; It also doesn't allow `promises`; The manifest_version should be set
to 3 to allow them ( or just refactor the code, to not use them ).
