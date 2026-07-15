$files = @(
  "src/app/services/local-taxi/page.tsx",
  "src/app/services/one-way/page.tsx",
  "src/app/services/outstation/page.tsx",
  "src/app/services/round-trip/page.tsx",
  "src/app/services/two-way/page.tsx",
  "src/app/services/wedding-car-rental/page.tsx",
  "src/app/services/corporate-car-rental/page.tsx",
  "src/app/kolkata-to-jamshedpur-cab/page.tsx",
  "src/app/kolkata-cab-vs-ola-uber/page.tsx"
)
foreach ($f in $files) {
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    if ($c -notmatch "force-static") {
      $insert = "export const dynamic = 'force-static';`r`nexport const revalidate = false;`r`n`r`n"
      $c = $c -replace "(export const metadata|export default function)", ($insert + '$1')
      Set-Content $f $c -Encoding UTF8 -NoNewline
      Write-Host "Patched: $f"
    } else {
      Write-Host "Skip (already has): $f"
    }
  } else {
    Write-Host "Not found: $f"
  }
}
