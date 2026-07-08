export class EntityRegistry<T extends { readonly id: string }> {
  readonly entities: T[] = [];
  readonly entitiesByIdsMap: Map<string, T> = new Map();

  constructor(readonly params: { readonly name: string }) {}

  register(entity: T): void {
    if (this.entitiesByIdsMap.has(entity.id))
      throw new Error(
        `${this.params.name} Registry: Entity with id ${entity.id} is already registered`,
      );

    this.entitiesByIdsMap.set(entity.id, entity);

    this.entities.push(entity);
  }

  getEntityById(id: string): T {
    const entity = this.entitiesByIdsMap.get(id);

    if (!entity) {
      throw new Error(`${this.params.name} Registry: Cannot find entity with id ${id}`);
    }

    return entity;
  }
}
