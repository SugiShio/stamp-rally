export class VisitRecord {
  constructor(visitRecord) {
    this.visitedAt = visitRecord.visitedAt
    this.uid = visitRecord.uid
    this.collection = visitRecord.collection
    this.collectionId = visitRecord.collectionId
    this.spot = visitRecord.spot || null
  }
}