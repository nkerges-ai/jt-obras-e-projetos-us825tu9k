migrate(
  (app) => {
    const certId = app.findCollectionByNameOrId('certificates').id
    const collection = new Collection({
      name: 'attendance_lists',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'certificate_id',
          type: 'relation',
          required: true,
          collectionId: certId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'name', type: 'text', required: true },
        { name: 'presence', type: 'bool' },
        { name: 'observations', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('attendance_lists')
    app.delete(collection)
  },
)
