$files = Get-ChildItem -Path "C:\Users\진선유\Downloads\커서\컬러모어톤랩" -Recurse -Filter "*.html"
foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)"
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $content = $content -replace 'content="vnqBy3aQtFRNgqglh3m3ATc2MnZ5PjiFwBi-0th2VOs"', 'content="X6-cRaQgrmeDuGaAIOpzrmnxvOxfRTQQdRaXlLT9u1Q"'
    $content = $content -replace 'content="ea088e7c37bd8b8356fad5e580fb507bee4129d5"', 'content="ce36545b94b14b24e73f2d2722dddfe856e37cd0"'
    Set-Content $file.FullName $content -Encoding UTF8
}