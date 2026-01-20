# Icon Generation Instructions

Since Python/PIL is not available, here are 3 easy ways to create the required icons:

## Option 1: Use Online Icon Generator (Easiest)

1. Visit: https://www.favicon-generator.org/ or https://www.websiteplanet.com/webtools/favicon-generator/
2. Upload any image or create a simple design
3. Download the generated icons
4. Rename them to: `icon16.png`, `icon48.png`, `icon128.png`
5. Place them in the `icons/` folder

## Option 2: Use the HTML Generator (Recommended)

1. Open the file `icons/icon-generator.html` in your browser
2. Click each button to download the three icon files
3. Move them to the `icons/` folder
4. They're already named correctly!

## Option 3: Create Manually

Use any image editor (Paint, GIMP, Photoshop, etc.):

1. Create a 16x16 pixel image with a blue background
2. Save as `icon16.png`
3. Repeat for 48x48 and 128x128
4. Place all in the `icons/` folder

## Option 4: Use PowerShell to Download Sample Icons

Run this in PowerShell from the `quick-book` directory:

```powershell
# Create simple colored PNG files using .NET
Add-Type -AssemblyName System.Drawing

$sizes = @(16, 48, 128)
foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(52, 152, 219))
    $graphics.FillRectangle($brush, 0, 0, $size, $size)

    # Add white "H"
    $font = New-Object System.Drawing.Font("Arial", $size * 0.6, [System.Drawing.FontStyle]::Bold)
    $stringFormat = New-Object System.Drawing.StringFormat
    $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $graphics.DrawString("H", $font, $whiteBrush, $size/2, $size/2, $stringFormat)

    $bmp.Save("icons\icon$size.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $graphics.Dispose()
}

Write-Host "Icons created successfully!"
```

After creating the icons, verify they exist:

- `icons/icon16.png`
- `icons/icon48.png`
- `icons/icon128.png`

Then you can load the extension in Chrome!
