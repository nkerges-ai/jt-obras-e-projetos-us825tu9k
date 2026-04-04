migrate(
  (app) => {
    const collection = new Collection({
      name: 'certificates',
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
        {
          name: 'nr_type',
          type: 'select',
          required: true,
          values: ['NR-06', 'NR-10', 'NR-18', 'NR-35'],
          maxSelect: 1,
        },
        { name: 'collaborator_name', type: 'text', required: true },
        { name: 'training_date', type: 'date', required: true },
        { name: 'hours', type: 'number', required: true },
        {
          name: 'technician_signature',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png'],
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['draft', 'completed'],
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
    const collection = app.findCollectionByNameOrId('certificates')
    app.delete(collection)
  },
)
