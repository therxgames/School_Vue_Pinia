export const parserDataSearch = (data, subsystemCode) => {
  const resultData = {}

  switch (subsystemCode) {
    case "material_library":
      resultData.title = data.title
      resultData.description = data.description
      resultData.id = data.id
      resultData.publishedAt = data.publishedAt
      resultData.subsystemCode = data[subsystemCode]
      resultData.courses = data.courses
      resultData.viewCount = data.viewCount
      resultData.supplier = data.supplier
      resultData.collection = data.collection
      resultData.classses = data.classes
      resultData.cover = data.cover
      resultData.isOnline = data.isOnline
      resultData.region = data.region
      resultData.source = 'Библиотека материалов'
      return resultData

    case "calendar":
      resultData.title = data.name
      resultData.description = data.description
      resultData.id = data.id
      resultData.publishedAt = data.dateStart
      resultData.subsystemCode = data[subsystemCode]
      resultData.courses = data.courses
      resultData.viewCount = data.viewCount
      resultData.classes = data.classes
      resultData.cover = data.cover
      resultData.isOnline = data.isOnline
      resultData.region = data.region
      resultData.supplier = data.supplier
      resultData.collection = data.collection
      resultData.source = 'Календарь'
      return resultData
    default:
      return resultData
  }
}
