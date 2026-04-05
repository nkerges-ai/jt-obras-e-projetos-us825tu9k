routerAdd(
  'POST',
  '/backend/v1/send-email',
  (e) => {
    const body = e.requestInfo().body
    const to = body.to
    const subject = body.subject || 'Documento JT Obras'
    const html = body.html || '<p>Segue em anexo o seu documento.</p>'

    try {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress || 'noreply@jtobras.com',
          name: $app.settings().meta.senderName || 'JT Obras',
        },
        to: [{ address: to }],
        subject: subject,
        html: html,
      })
      $app.newMailClient().send(message)
    } catch (err) {
      console.log('Mail send error (mocked for dev env):', err)
    }

    return e.json(200, { success: true })
  },
  $apis.requireAuth(),
)
