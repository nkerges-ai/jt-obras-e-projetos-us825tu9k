routerAdd(
  'POST',
  '/backend/v1/certificates/{id}/send-email',
  (e) => {
    const id = e.request.pathValue('id')
    const data = e.requestInfo().body

    // Simulated email dispatch
    console.log('Email notification dispatch triggered for certificate', id, 'to', data.email)

    return e.json(200, { message: 'Email dispatched successfully' })
  },
  $apis.requireAuth(),
)
