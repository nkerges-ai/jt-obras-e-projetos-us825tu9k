export function exportHtmlToWord(htmlContent: string, fileName: string) {
  // Create a temporary element to parse and clean the HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent

  // Remove elements that shouldn't be printed or exported
  const hiddenEls = tempDiv.querySelectorAll('.print\\:hidden, button, [role="dialog"]')
  hiddenEls.forEach((el) => el.remove())

  // Make image URLs absolute so Word can load them
  const imgs = tempDiv.querySelectorAll('img')
  imgs.forEach((img) => {
    if (img.src.startsWith('/')) {
      img.src = window.location.origin + img.src
    }
  })

  // Convert specific tailwind classes to inline styles for MS Word compatibility
  const applyInline = (selector: string, styleText: string) => {
    try {
      tempDiv.querySelectorAll(selector).forEach((el) => {
        ;(el as HTMLElement).style.cssText += styleText
      })
    } catch (e) {
      // ignore invalid selectors if they occur
    }
  }

  // Inject styles directly for key visual fidelity features like letterhead
  applyInline('.border-b-\\[6px\\]', 'border-bottom: 6px solid #005A9C;')
  applyInline('.border-\\[\\#005A9C\\]', 'border-color: #005A9C;')
  applyInline('.text-\\[\\#005A9C\\]', 'color: #005A9C;')
  applyInline('.text-brand-navy', 'color: #005A9C;')
  applyInline('.bg-brand-navy', 'background-color: #005A9C; color: #ffffff;')
  applyInline('.text-\\[\\#009FE3\\]', 'color: #009FE3;')
  applyInline('.border-l-2', 'border-left: 2px solid #009FE3;')
  applyInline('.text-center', 'text-align: center;')
  applyInline('.text-right', 'text-align: right;')
  applyInline('.font-bold', 'font-weight: bold;')
  applyInline('.uppercase', 'text-transform: uppercase;')
  applyInline('.tracking-widest', 'letter-spacing: 0.1em;')

  const cleanHtml = tempDiv.innerHTML
  const safeName = fileName.replace(/[^a-zA-Z0-9_\-\s]/g, '_').trim()
  const finalName = `${safeName}_${new Date().toISOString().split('T')[0]}.doc`

  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${fileName}</title>
      <style>
        @page {
          margin: 1.5cm;
          mso-page-orientation: portrait;
        }
        body { 
          font-family: Arial, sans-serif; 
          font-size: 11pt; 
          color: #333; 
          line-height: 1.5;
        }
        table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top; }
        th { background-color: #f3f4f6; font-weight: bold; }
        h1, h2, h3, h4, h5 { color: #005A9C; margin-bottom: 10px; }
        .text-brand-navy { color: #005A9C; }
        .text-brand-light { color: #009FE3; }
        .bg-brand-navy { background-color: #005A9C; color: #fff; }
        .font-bold { font-weight: bold; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-justify { text-align: justify; }
        .text-gray-500 { color: #6b7280; }
        .text-gray-800 { color: #1f2937; }
        .mb-2 { margin-bottom: 8px; }
        .mb-4 { margin-bottom: 16px; }
        .mt-2 { margin-top: 8px; }
        .mt-4 { margin-top: 16px; }
        .p-2 { padding: 8px; }
        .p-4 { padding: 16px; }
        .border-b { border-bottom: 1px solid #ccc; }
        .border-t { border-top: 1px solid #ccc; }
        .uppercase { text-transform: uppercase; }
        img { max-width: 100%; height: auto; }
      </style>
    </head>
    <body>
      ${cleanHtml}
    </body>
  </html>`

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = finalName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
