routerAdd(
  'POST',
  '/backend/v1/documents/{collection}/{id}/send-email',
  (e) => {
    const collection = e.request.pathValue('collection')
    const id = e.request.pathValue('id')
    const body = e.requestInfo().body

    // Simulated email dispatch
    console.log(`Sending email for ${collection} ${id} to ${body.email}`)

    return e.json(200, { message: 'Email dispatched successfully' })
  },
  $apis.requireAuth(),
)

routerAdd(
  'POST',
  '/backend/v1/documents/{collection}/{id}/generate-pdf',
  (e) => {
    const collection = e.request.pathValue('collection')
    const id = e.request.pathValue('id')

    try {
      const record = $app.findRecordById(collection, id)
      // Simulate PDF generation and save URL process
      return e.json(200, { message: 'PDF generated successfully', url: 'generated-pdf-url' })
    } catch (err) {
      return e.json(404, { message: 'Record not found' })
    }
  },
  $apis.requireAuth(),
)
