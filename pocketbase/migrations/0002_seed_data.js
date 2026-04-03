migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'nkerges@gmail.com')
    } catch (_) {
      const record = new Record(users)
      record.setEmail('nkerges@gmail.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Admin')
      app.save(record)
    }

    const customersCol = app.findCollectionByNameOrId('customers')
    const projectsCol = app.findCollectionByNameOrId('projects')

    const seedCustomers = [
      {
        name: 'Tech Corp',
        email: 'contato@techcorp.com',
        phone: '(11) 99999-9999',
        tax_id: '12.345.678/0001-90',
        type: 'PJ',
        address_street: 'Av Paulista',
        address_number: '1000',
        address_complement: 'Sala 10',
        address_city: 'São Paulo',
        address_state: 'SP',
        address_zip: '01310-100',
      },
      {
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(21) 98888-8888',
        tax_id: '123.456.789-00',
        type: 'PF',
        address_street: 'Rua das Flores',
        address_number: '123',
        address_complement: '',
        address_city: 'Rio de Janeiro',
        address_state: 'RJ',
        address_zip: '20000-000',
      },
      {
        name: 'Construtora Alfa',
        email: 'alfa@construtora.com',
        phone: '(31) 3333-3333',
        tax_id: '98.765.432/0001-10',
        type: 'PJ',
        address_street: 'Av Afonso Pena',
        address_number: '500',
        address_complement: 'Andar 2',
        address_city: 'Belo Horizonte',
        address_state: 'MG',
        address_zip: '30000-000',
      },
    ]

    const savedCustomers = []
    for (const c of seedCustomers) {
      try {
        const existing = app.findFirstRecordByData('customers', 'email', c.email)
        savedCustomers.push(existing)
      } catch (_) {
        const rec = new Record(customersCol)
        rec.set('name', c.name)
        rec.set('email', c.email)
        rec.set('phone', c.phone)
        rec.set('tax_id', c.tax_id)
        rec.set('type', c.type)
        rec.set('address_street', c.address_street)
        rec.set('address_number', c.address_number)
        rec.set('address_complement', c.address_complement)
        rec.set('address_city', c.address_city)
        rec.set('address_state', c.address_state)
        rec.set('address_zip', c.address_zip)
        app.save(rec)
        savedCustomers.push(rec)
      }
    }

    if (savedCustomers.length >= 3) {
      const seedProjects = [
        {
          client_id: savedCustomers[0].id,
          name: 'Reforma Sede',
          address: 'Av Paulista 1000',
          start_date: '2026-01-10 12:00:00.000Z',
          deadline_days: 90,
          total_value: 150000,
          description: 'Reforma completa da sede administrativa',
          status: 'In Execution',
        },
        {
          client_id: savedCustomers[1].id,
          name: 'Casa de Praia',
          address: 'Buzios, RJ',
          start_date: '2026-03-01 12:00:00.000Z',
          deadline_days: 180,
          total_value: 500000,
          description: 'Construção de residência unifamiliar',
          status: 'Planning',
        },
        {
          client_id: savedCustomers[2].id,
          name: 'Galpão Logístico',
          address: 'Contagem, MG',
          start_date: '2026-02-15 12:00:00.000Z',
          deadline_days: 120,
          total_value: 850000,
          description: 'Construção de galpão para centro de distribuição',
          status: 'Completed',
        },
      ]

      for (const p of seedProjects) {
        try {
          app.findFirstRecordByData('projects', 'name', p.name)
        } catch (_) {
          const rec = new Record(projectsCol)
          rec.set('client_id', p.client_id)
          rec.set('name', p.name)
          rec.set('address', p.address)
          rec.set('start_date', p.start_date)
          rec.set('deadline_days', p.deadline_days)
          rec.set('total_value', p.total_value)
          rec.set('description', p.description)
          rec.set('status', p.status)
          app.save(rec)
        }
      }
    }
  },
  (app) => {},
)
