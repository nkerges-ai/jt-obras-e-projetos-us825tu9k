migrate(
  (app) => {
    const collections = [
      'customers',
      'projects',
      'certificates',
      'attendance_lists',
      'contracts',
      'budgets',
      'evidence',
    ]
    collections.forEach((c) => {
      try {
        const col = app.findCollectionByNameOrId(c)
        app.truncateCollection(col)
      } catch (_) {}
    })
  },
  (app) => {},
)
