# Fetching all guides from reddit
$urlsfile = "data/urls.txt"
$urls = Get-Content $urlsfile
$userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

foreach ($url in $urls) {
    if ($url -match "reddit.com") {
        $cleanUrl = $url.TrimEnd('/')
        $filename = [System.IO.Path]::GetFileName($cleanUrl) + ".json"
        
        Write-Host "Downloading $cleanUrl.json to data/$filename ..."
        try {
            Invoke-WebRequest -Uri ($cleanUrl + ".json") -OutFile ("data/" + $filename) -UserAgent $userAgent -ErrorAction Stop
        } catch {
            Write-Host "Failed full URL, trying short ID format..."
            if ($cleanUrl -match "comments/([^/]+)") {
                $id = $matches[1]
                $shortUrl = "https://www.reddit.com/comments/$id"
                try {
                    Invoke-WebRequest -Uri ($shortUrl + ".json") -OutFile ("data/" + $filename) -UserAgent $userAgent -ErrorAction Stop
                    Write-Host "Success with short URL!"
                } catch {
                    Write-Host "Failed short URL too: $_"
                }
            } else {
                Write-Host "Couldn't find ID in $url"
            }
        }
    }
}
