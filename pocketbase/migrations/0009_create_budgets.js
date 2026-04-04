migrate(
  (app) => {
    const collection = new Collection({
      name: 'budgets',
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
        { name: 'content_json', type: 'json' },
        { name: 'total_value', type: 'number' },
        { name: 'validity', type: 'date' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['draft', 'sent', 'approved', 'rejected'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('budgets')
    app.delete(collection)
  },
)
