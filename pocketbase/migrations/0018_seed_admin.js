migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'admin@jtobras.com.br')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('admin@jtobras.com.br')
    record.setPassword('JOELTATIANA')
    record.setVerified(true)
    record.set('name', 'Admin JT Obras')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'admin@jtobras.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
