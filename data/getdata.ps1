# Fetching all guides from reddit
$urlsfile = "urls.txt"
$urls = Get-Content $urlsfile
foreach ($url in $urls) {
    $filename = [System.IO.Path]::GetFileNameWithoutExtension($url) + ".json"
    Invoke-WebRequest -Uri ($url + ".json") -OutFile $filename
}