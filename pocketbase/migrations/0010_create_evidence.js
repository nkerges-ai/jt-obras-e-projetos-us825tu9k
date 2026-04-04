migrate(
  (app) => {
    const collection = new Collection({
      name: 'evidence',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'related_id', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['photo', 'video', 'doc'],
          maxSelect: 1,
        },
        {
          name: 'file',
          type: 'file',
          required: true,
          maxSelect: 1,
          maxSize: 52428800,
          mimeTypes: [
            'image/jpeg',
            'image/png',
            'video/mp4',
            'video/quicktime',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ],
        },
        { name: 'description', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('evidence')
    app.delete(collection)
  },
)
