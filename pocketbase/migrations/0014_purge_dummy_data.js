migrate(
  (app) => {
    const collectionsToClean = [
      'certificates',
      'contracts',
      'budgets',
      'attendance_lists',
      'evidence',
    ]

    for (const name of collectionsToClean) {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.truncateCollection(col)
        console.log(`Cleaned ${name} successfully.`)
      } catch (err) {
        console.log(`Skipped cleaning ${name} - collection not found.`)
      }
    }
  },
  (app) => {
    // Down migration is not possible for data deletion
  },
)
