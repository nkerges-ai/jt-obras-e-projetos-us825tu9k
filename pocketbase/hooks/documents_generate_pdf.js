routerAdd(
  'POST',
  '/backend/v1/documents/certificates/{id}/generate-pdf',
  (e) => {
    const id = e.request.pathValue('id')
    // Mock PDF generation trigger
    return e.json(200, {
      success: true,
      message: 'PDF gerado com sucesso.',
      url: `/api/files/certificates/${id}/mock.pdf`,
    })
  },
  $apis.requireAuth(),
)

routerAdd(
  'POST',
  '/backend/v1/documents/contracts/{id}/generate-pdf',
  (e) => {
    const id = e.request.pathValue('id')
    // Mock PDF generation trigger
    return e.json(200, {
      success: true,
      message: 'PDF gerado com sucesso.',
      url: `/api/files/contracts/${id}/mock.pdf`,
    })
  },
  $apis.requireAuth(),
)

routerAdd(
  'POST',
  '/backend/v1/documents/budgets/{id}/generate-pdf',
  (e) => {
    const id = e.request.pathValue('id')
    // Mock PDF generation trigger
    return e.json(200, {
      success: true,
      message: 'PDF gerado com sucesso.',
      url: `/api/files/budgets/${id}/mock.pdf`,
    })
  },
  $apis.requireAuth(),
)
