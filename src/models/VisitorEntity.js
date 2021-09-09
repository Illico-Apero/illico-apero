export default class VisitorEntity {

    constructor(idVisitor, ip, createdAt, visitedComponent) {
        this.idVisitor = idVisitor;
        this.ip = ip;
        this.createdAt = createdAt;
        this.visitedComponent = visitedComponent;
    }
}