migrate(
  (app) => {
    const contracts = app.findCollectionByNameOrId('contracts')
    if (!contracts.fields.getByName('collaborator_cpf')) {
      contracts.fields.add(new TextField({ name: 'collaborator_cpf' }))
    }
    if (!contracts.fields.getByName('technician_cpf')) {
      contracts.fields.add(new TextField({ name: 'technician_cpf' }))
    }
    app.save(contracts)

    const budgets = app.findCollectionByNameOrId('budgets')
    if (!budgets.fields.getByName('collaborator_cpf')) {
      budgets.fields.add(new TextField({ name: 'collaborator_cpf' }))
    }
    if (!budgets.fields.getByName('technician_cpf')) {
      budgets.fields.add(new TextField({ name: 'technician_cpf' }))
    }
    app.save(budgets)
  },
  (app) => {
    const contracts = app.findCollectionByNameOrId('contracts')
    contracts.fields.removeByName('collaborator_cpf')
    contracts.fields.removeByName('technician_cpf')
    app.save(contracts)

    const budgets = app.findCollectionByNameOrId('budgets')
    budgets.fields.removeByName('collaborator_cpf')
    budgets.fields.removeByName('technician_cpf')
    app.save(budgets)
  },
)
