migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.fields.add(
      new FileField({
        name: 'company_logo',
        maxSelect: 1,
        mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
      }),
    )
    app.save(users)
  },
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.fields.removeByName('company_logo')
    app.save(users)
  },
)
