migrate(
  (app) => {
    const customers = new Collection({
      name: 'customers',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'tax_id', type: 'text', required: true },
        { name: 'type', type: 'select', required: true, values: ['PF', 'PJ'], maxSelect: 1 },
        { name: 'address_street', type: 'text', required: true },
        { name: 'address_number', type: 'text', required: true },
        { name: 'address_complement', type: 'text' },
        { name: 'address_city', type: 'text', required: true },
        { name: 'address_state', type: 'text', required: true },
        { name: 'address_zip', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(customers)

    const projects = new Collection({
      name: 'projects',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        {
          name: 'client_id',
          type: 'relation',
          required: true,
          collectionId: customers.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'name', type: 'text', required: true },
        { name: 'address', type: 'text', required: true },
        { name: 'start_date', type: 'date', required: true },
        { name: 'deadline_days', type: 'number', required: true },
        { name: 'total_value', type: 'number', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['Planning', 'In Execution', 'Paused', 'Completed'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(projects)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('projects'))
    } catch (e) {}
    try {
      app.delete(app.findCollectionByNameOrId('customers'))
    } catch (e) {}
  },
)
