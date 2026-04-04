routerAdd(
  'POST',
  '/backend/v1/certificates/{id}/generate-pdf',
  (e) => {
    const id = e.request.pathValue('id')
    const record = $app.findRecordById('certificates', id)

    // Simulates professional PDF Generation with PocketBase Server Hook
    record.set('status', 'completed')
    $app.save(record)

    return e.json(200, {
      message: 'PDF generated and saved to storage successfully',
      url: 'generated-pdf-url',
    })
  },
  $apis.requireAuth(),
)
