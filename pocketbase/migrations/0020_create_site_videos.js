migrate(
  (app) => {
    const collection = new Collection({
      name: 'site_videos',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'category', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'video_url', type: 'text' },
        {
          name: 'video_file',
          type: 'file',
          maxSelect: 1,
          maxSize: 104857600,
          mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
        },
        {
          name: 'poster',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'active', type: 'bool' },
        { name: 'order', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('site_videos')
      app.delete(collection)
    } catch (_) {}
  },
)
