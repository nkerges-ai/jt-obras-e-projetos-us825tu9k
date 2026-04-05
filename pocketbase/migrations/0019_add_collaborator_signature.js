migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('certificates')

    if (!col.fields.getByName('collaborator_signature')) {
      col.fields.add(
        new FileField({
          name: 'collaborator_signature',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
        }),
      )
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('certificates')
    col.fields.removeByName('collaborator_signature')
    app.save(col)
  },
)
