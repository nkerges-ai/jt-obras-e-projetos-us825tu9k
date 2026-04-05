migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    if (!users.fields.getByName('cpf')) {
      users.fields.add(new TextField({ name: 'cpf' }))
    }
    app.save(users)

    const certs = app.findCollectionByNameOrId('certificates')
    if (!certs.fields.getByName('collaborator_cpf')) {
      certs.fields.add(new TextField({ name: 'collaborator_cpf' }))
    }
    if (!certs.fields.getByName('technician_cpf')) {
      certs.fields.add(new TextField({ name: 'technician_cpf' }))
    }
    app.save(certs)

    const lists = app.findCollectionByNameOrId('attendance_lists')
    if (!lists.fields.getByName('cpf')) {
      lists.fields.add(new TextField({ name: 'cpf' }))
    }
    app.save(lists)
  },
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.fields.removeByName('cpf')
    app.save(users)

    const certs = app.findCollectionByNameOrId('certificates')
    certs.fields.removeByName('collaborator_cpf')
    certs.fields.removeByName('technician_cpf')
    app.save(certs)

    const lists = app.findCollectionByNameOrId('attendance_lists')
    lists.fields.removeByName('cpf')
    app.save(lists)
  },
)
