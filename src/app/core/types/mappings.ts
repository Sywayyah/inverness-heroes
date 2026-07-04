export type MappedRecordTypes<T extends object> = {
  [K in keyof T]: { readonly type: K; readonly params: T[K] };
}[keyof T];
