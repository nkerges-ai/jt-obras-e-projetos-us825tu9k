migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')

    if (!users.fields.getByName('rg')) {
      users.fields.add(new TextField({ name: 'rg' }))
    }
    if (!users.fields.getByName('cnpj')) {
      users.fields.add(new TextField({ name: 'cnpj' }))
    }
    if (!users.fields.getByName('address')) {
      users.fields.add(new TextField({ name: 'address' }))
    }

    app.save(users)
  },
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.fields.removeByName('rg')
    users.fields.removeByName('cnpj')
    users.fields.removeByName('address')
    app.save(users)
  },
)
