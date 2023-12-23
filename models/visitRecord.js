export class VisitRecord {
  constructor(visitRecord = {}) {
    this.visitedAt = visitRecord.visitedAt || new Date().getTime()
    this.uid = visitRecord.uid
    this.collection = visitRecord.collection
    this.collectionId = visitRecord.collectionId
    this.description = visitRecord.description
    this.spot = visitRecord.spot || null
  }

  get visitedAtText() {
    const dateObject = new Date(this.visitedAt)
    const year = dateObject.getFullYear()
    const month = dateObject.getMonth()
    const date = dateObject.getDate()
    return `${year}.${month + 1}.${date}`
  }
}