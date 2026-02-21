Add-Type -AssemblyName System.Drawing

function Create-Icon($size, $filename) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Green background
    $greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(39, 174, 96))
    $graphics.FillRectangle($greenBrush, 0, 0, $size, $size)
    
    # White circle
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $padding = [int]($size / 6)
    $graphics.FillEllipse($whiteBrush, $padding, $padding, $size - 2*$padding, $size - 2*$padding)
    
    # Small green circle in center
    $centerSize = [int]($size / 4)
    $centerPos = [int](($size - $centerSize) / 2)
    $graphics.FillEllipse($greenBrush, $centerPos, $centerPos, $centerSize, $centerSize)
    
    $bmp.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bmp.Dispose()
    Write-Host "Created $filename"
}

Create-Icon 16 "icon16.png"
Create-Icon 48 "icon48.png"
Create-Icon 128 "icon128.png"
Write-Host "All icons created successfully!"
