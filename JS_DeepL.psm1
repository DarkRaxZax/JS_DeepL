function deepl{
  param($translate)
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
  return (node "PATH_FILE_GOES_HERE" $translate)
}
