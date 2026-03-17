# Download spreadsheets as CSV
$links = @(
    "https://docs.google.com/spreadsheets/d/1cV7RY6F8QzjCtvmzNKKV7ly2H8cMoiL2BDlFVnFZZYc",
    "https://docs.google.com/spreadsheets/d/1LzT-Bn-SE21fn0Br1rwPlYB6vI6SlCWC7E99MNA2WLc",
    "https://docs.google.com/spreadsheets/d/1h2wGvEB7r0vPzRbIxxfQ1a5uyGMaJpl9uAfsTKq3-lY",
    "https://docs.google.com/spreadsheets/d/1yuBCN6uVIL8tsUxTUp5hq1qxTV-I3WYhKfgvcfAG3yM",
    "https://docs.google.com/spreadsheets/d/1IBVcc7KPvlb31sWSJL44CuKjFMCQozMxsS3G0u6920w"
)

foreach ($link in $links) {
    $id = [regex]::Match($link, '/d/([a-zA-Z0-9-_]+)').Groups[1].Value
    $outFile = "data/sheet_$id.csv"
    $downloadUrl = "$link/export?format=csv"
    
    Write-Host "Downloading $downloadUrl to $outFile ..."
    try {
        Invoke-WebRequest -Uri $downloadUrl -OutFile $outFile -ErrorAction Stop
    } catch {
        Write-Host "Failed to download $link : $_"
    }
}
