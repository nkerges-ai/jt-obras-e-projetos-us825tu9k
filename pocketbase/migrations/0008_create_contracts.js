migrate(
  (app) => {
    const collection = new Collection({
      name: 'contracts',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'client_name', type: 'text', required: true },
        { name: 'content_html', type: 'editor' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['draft', 'active', 'completed', 'cancelled'],
          maxSelect: 1,
        },
        {
          name: 'pdf_url',
          type: 'file',
          maxSelect: 1,
          maxSize: 10485760,
          mimeTypes: ['application/pdf'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('contracts')
    app.delete(collection)
  },
)
