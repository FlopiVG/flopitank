type ObjectWithId = object extends { id: string } ? never : { id: string };

export class Entities {
  private entities: Record<string, ObjectWithId>;

  constructor() {
    this.entities = {};
  }

  public add(entity: ObjectWithId): void {
    this.entities = { ...this.entities, [entity.id]: entity };
  }

  public getAll(): Record<string, ObjectWithId> {
    return this.entities;
  }
}
