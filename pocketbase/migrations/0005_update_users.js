migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    if (!users.fields.getByName('phone')) {
      users.fields.add(new TextField({ name: 'phone' }))
    }
    if (!users.fields.getByName('company')) {
      users.fields.add(new TextField({ name: 'company' }))
    }
    if (!users.fields.getByName('signature')) {
      users.fields.add(
        new FileField({
          name: 'signature',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
        }),
      )
    }
    app.save(users)
  },
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.fields.removeByName('phone')
    users.fields.removeByName('company')
    users.fields.removeByName('signature')
    app.save(users)
  },
)
