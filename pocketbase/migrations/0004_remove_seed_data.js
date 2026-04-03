migrate(
  (app) => {
    try {
      const customersCol = app.findCollectionByNameOrId('customers')
      app.truncateCollection(customersCol)
    } catch (_) {
      // Collection might not exist, ignore
    }

    try {
      const projectsCol = app.findCollectionByNameOrId('projects')
      app.truncateCollection(projectsCol)
    } catch (_) {
      // Collection might not exist, ignore
    }
  },
  (app) => {
    // Reverting seed deletion is not necessary or possible without data snapshots
  },
)
