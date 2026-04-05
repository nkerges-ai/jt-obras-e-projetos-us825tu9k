migrate(
  (app) => {
    const collections = [
      'customers',
      'projects',
      'certificates',
      'contracts',
      'budgets',
      'evidence',
    ]
    collections.forEach((colName) => {
      try {
        const records = app.findRecordsByFilter(colName, '1=1', '', 1000, 0)
        records.forEach((r) => {
          let isTest = false
          const data = JSON.parse(JSON.stringify(r))
          for (const key in data) {
            if (typeof data[key] === 'string') {
              const val = data[key].toLowerCase()
              if (val.includes('test') || val.includes('lorem') || val.includes('ipsum')) {
                isTest = true
                break
              }
            }
          }
          if (isTest) {
            app.delete(r)
          }
        })
      } catch (e) {
        // ignore if collection is empty or not found
      }
    })
  },
  (app) => {
    // Irreversible operation
  },
)
