migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('projects')

    if (col.fields.getByName('address')) {
      col.fields.removeByName('address')
    }

    if (!col.fields.getByName('address_street'))
      col.fields.add(new TextField({ name: 'address_street', required: true }))
    if (!col.fields.getByName('address_number'))
      col.fields.add(new TextField({ name: 'address_number', required: true }))
    if (!col.fields.getByName('address_complement'))
      col.fields.add(new TextField({ name: 'address_complement' }))
    if (!col.fields.getByName('address_city'))
      col.fields.add(new TextField({ name: 'address_city', required: true }))
    if (!col.fields.getByName('address_state'))
      col.fields.add(new TextField({ name: 'address_state', required: true }))
    if (!col.fields.getByName('address_zip'))
      col.fields.add(new TextField({ name: 'address_zip', required: true }))

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('projects')

    if (!col.fields.getByName('address'))
      col.fields.add(new TextField({ name: 'address', required: true }))

    col.fields.removeByName('address_street')
    col.fields.removeByName('address_number')
    col.fields.removeByName('address_complement')
    col.fields.removeByName('address_city')
    col.fields.removeByName('address_state')
    col.fields.removeByName('address_zip')

    app.save(col)
  },
)
