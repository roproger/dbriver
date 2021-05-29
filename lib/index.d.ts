import { PoolConfig } from "mysql"
import {
  Connection,
  ConnectionConfig,
  ConnectionOptions,
  EscapeFunctions,
  FieldInfo,
  OkPacket,
  QueryOptions,
} from "mysql"

export const version: string
export function createConnector(options: Config): ConnectorInstance

declare type Config = ConnectionConfig & { autoreconnect?: boolean }

declare interface ConnectorInstance
  extends SelectExtPrototype,
    UpdateExtPrototype,
    InsertExpPrototype,
    DeleteExpPrototype,
    UnionSelectExpPrototype,
    CacheExtPrototype {
  options: Config | null
  current: Connection | null

  connect(): Promise<Connection>
  close(immediately?: boolean): Promise<void>
  destroy(): void
  query: QueryFunction
  fetch: FetchFunction
  changeUser(options: ConnectionOptions): Promise<Connection>
  pause(): void
  resume(): void
  readonly threadId: number | null
  readonly state: string | null
  ping(): Promise<void>
  escape: EscapeFunctions["escape"]
  escapeId: EscapeFunctions["escapeId"]
  clone(): ConnectorInstance
  use(database: string): Promise<Query>
}

declare interface QueryFunction {
  (sql: string, values: QueryValues, options: QueryOptions): Promise<Query>
  (sql: string, options: QueryOptions): Promise<Query>
}

declare interface FetchOptions extends QueryOptions {
  one?: boolean
  index?: number
}

declare interface FetchFunction {
  (sql: string, values: QueryValues, options: FetchOptions): Promise<any>
  (sql: string, options: FetchOptions): Promise<any>
}

declare type QueryValues = any[]

declare interface Query {
  results?: OkPacket
  fields?: FieldInfo[]
}

declare interface CacheExtPrototype {
  cache: CacheInstance<string, ToSql>["cache"]
}

declare interface CacheInstance<T extends string, J extends ToSql>
  extends ClonePrototype<CacheInstance<T, J>> {
  cache<K extends string, I extends ToSql>(
    replacers: Array<K>,
    constructor: (patterns: { [key in K]: any }) => I
  ): CacheInstance<K, I>
  expand(
    expander: (instance: J, patterns: { [key in T]: any }) => void
  ): CacheInstance<T, J>
  toSqlString(replacers?: { [key in T]: any }): string
}

declare interface UnionSelectExpPrototype {
  unionSelect: UnionSelectInstance["unionSelect"]
}

declare interface UnionSelectInstance
  extends OrderByPart<UnionSelectInstance>,
    LimitPartWithOneParameter<UnionSelectInstance>,
    QueryPrototype,
    FetchPrototype,
    ClonePrototype<UnionSelectInstance> {
  unionSelect: (...parts: Array<UnionSelectPart>) => UnionSelectInstance
  toSqlString: () => string
}

declare type UnionSelectPart =
  | SelectInstance
  | UnionSelectPart[]
  | string
  | { all?: UnionSelectPart; distinct?: UnionSelectPart; table?: string }

declare interface DeleteExpPrototype {
  delete: DeleteInstance["delete"]
}

declare interface DeleteInstance
  extends FlagPart<DeleteInstance, "LOW_PRIORITY" | "QUICK" | "IGNORE">,
    WherePart<DeleteInstance>,
    OrderByPart<DeleteInstance>,
    LimitPartWithOneParameter<DeleteInstance>,
    QueryPrototype,
    FetchPrototype<OkPacket>,
    ClonePrototype<DeleteInstance> {
  delete: () => DeleteInstance
  from: (
    ...tblNames: Array<{ [key: string]: string } | string>
  ) => DeleteInstance
  using: (...tableReferences: TableReferences[]) => DeleteInstance
  toSqlString: () => string
}

declare interface InsertExpPrototype {
  insert: InsertInstance["insert"]
}

declare interface InsertInstance
  extends FlagPart<
      InsertInstance,
      "LOW_PRIORITY" | "DELAYED" | "HIGH_PRIORITY" | "IGNORE"
    >,
    QueryPrototype,
    FetchPrototype<OkPacket>,
    ClonePrototype<InsertInstance> {
  insert: (...values: InsertValue[]) => InsertInstance
  into: (tblName: string) => InsertInstance
  cols: (...cols: string[]) => InsertInstance
  as: (rowAlias: string, colAliases?: string[]) => InsertInstance
  onDuplicateKeyUpdate: (...assigmentList: AssigmentItem[]) => InsertInstance
  set: (...assigmentList: AssigmentItem[]) => InsertInstance
  select: (instance: string | SelectInstance) => InsertInstance
  table: (tblName: string) => InsertInstance
  toSqlString: () => string
}

declare type InsertValue =
  | Value[]
  | string
  | { row: InsertValue }
  | { [key: string]: Value }

declare interface UpdateExtPrototype {
  update: UpdateInstance["update"]
}

declare interface UpdateInstance
  extends FlagPart<UpdateInstance, "LOW_PRIORITY" | "IGNORE">,
    WherePart<UpdateInstance>,
    OrderByPart<UpdateInstance>,
    LimitPartWithOneParameter<UpdateInstance>,
    QueryPrototype,
    FetchPrototype<OkPacket>,
    ClonePrototype<UpdateInstance> {
  update(...tableReferences: TableReferences[]): UpdateInstance
  set(...assigmentList: AssigmentItem[]): UpdateInstance
  toSqlString(): string
}

declare type AssigmentItem = { [key: string]: Value } | string

declare interface SelectExtPrototype {
  select: SelectInstance["select"]
}

declare interface SelectInstance
  extends FlagPart<
      SelectInstance,
      | "ALL"
      | "DISTINCT"
      | "DISTINCTROW"
      | "HIGH_PRIORITY"
      | "STRAIGHT_JOIN"
      | "SQL_SMALL_RESULT"
      | "SQL_BIG_RESULT"
      | "SQL_BUFFER_RESULT"
      | "SQL_NO_CACHE"
      | "SQL_CALC_FOUND_ROWS"
    >,
    IntoPart<SelectInstance>,
    WherePart<SelectInstance>,
    GroupByPart<SelectInstance>,
    HavingPart<SelectInstance>,
    OrderByPart<SelectInstance>,
    LimitPart<SelectInstance>,
    LockPart<SelectInstance>,
    QueryPrototype,
    FetchPrototype,
    ClonePrototype<SelectInstance> {
  connector: ConnectorInstance

  select(...selectExpressions: Expression[]): SelectInstance
  from(...tableReferences: TableReferences[]): SelectInstance
  count(
    list: Array<{ distinct: string } | string>,
    options: FetchOptions
  ): SelectInstance
  toSqlString(): string
}

declare interface ClonePrototype<T> {
  clone(): T
}

declare interface QueryPrototype {
  query(values: QueryValues, options: QueryOptions): Promise<Query>
  query(options: QueryOptions): Promise<Query>
}

declare interface FetchPrototype<T = any> {
  fetch(values: QueryValues, options: FetchOptions): Promise<T>
  fetch(options: FetchOptions): Promise<T>
}

declare type LockPart<T> = {
  lockInShare: () => T
  lockFor: (options: {
    mode: "update" | "share"
    of: string[]
    flag: "nowait" | "skip locked"
  }) => T
}

declare type LimitPart<T> = {
  limit: (offset: number, length: number) => T
} & LimitPartWithOneParameter<T>

declare type LimitPartWithOneParameter<T> = {
  limit: (length: number) => T
}

declare type OrderByPart<T> = {
  orderBy: (...args: OrderByArg[]) => T
  orderByWithRollup: (...args: OrderByArg[]) => T
}

declare type OrderByArg =
  | [Expression, "asc" | "desc"]
  | { [key: string]: "asc" | "desc" }
  | string

declare type HavingPart<T> = {
  having: (...conditions: SearchCondition[]) => T
}

declare type GroupByPart<T> = {
  groupBy: (...args: GroupByArg[]) => T
  groupByWithRollup: (...args: GroupByArg[]) => T
}

declare type GroupByArg = number | Expression

declare type WherePart<T> = {
  where: (...whereConditions: SearchCondition[]) => T
}

declare type TableReferences = JoinExpression | Expression | TableReferences[]

declare type JoinExpression = {
  join: Expression
  prefix?: string
  using?: string[]
  on?: SearchCondition
}

declare type CondLeftRight =
  | string
  | {
      [key: string]:
        | ConstantExpression
        | ConstantEscapeValue
        | ConstantEscapeId
        | ToSql
        | {
            $?: {
              op: string
              value: Value
            }
            $eq?: Value
            $neq?: Value
            $lt?: Value
            $lte?: Value
            $gt?: Value
            $gte?: Value
            $nseq?: Value
            $btw?: [Value, Value]
            $nbtw?: [Value, Value]
            $in?: Value
            $nin?: Value
            $is?: null | string
            $isnt?: null | string
            $lk?: Value
            $nlk?: Value
          }
    }
  | CondLeftRight[]

declare type SearchCondition =
  | string
  | {
      $or?: CondLeftRight
      $and?: CondLeftRight
      $xor?: CondLeftRight
      $?: {
        left: Expression
        op: string
        right: Value
      }
    }
  | CondLeftRight
  | SearchCondition[]

declare type IntoPartOptions = {
  position: "afterExpression" | "afterLimit" | "afterLock"
  dumpFile?: string
  vars?: string[]
  outFile?: string
  charSet?: string
  fieldsTerminatedBy?: string
  fieldsEnclosedBy?: string
  fieldsEscapedBy?: string
  columnsTerminatedBy?: string
  columnsEnclosedBy?: string
  columnsEscapedBy?: string
  linesStartingBy?: string
  linesTerminatedBy?: string
}
declare type IntoPart<T> = {
  into: (options: IntoPartOptions) => T
}

declare type FlagPart<T, K> = {
  flag: (name: K, show?: boolean) => T
}

declare type ToSql =
  | SelectInstance
  | DeleteInstance
  | UpdateInstance
  | InsertInstance
  | UnionSelectInstance
  | CacheInstance

declare type ConstantExpression = { $: any }
declare type ConstantEscapeValue = {
  $e: any
  stringifyObjects?: boolean
  timeZone?: string
}
declare type ConstantEscapeId = { $eId: any; forbidQualified?: boolean }

declare type Value =
  | null
  | string
  | number
  | Date
  | Value[]
  | ConstantExpression
  | ToSql
  | ConstantEscapeValue
  | ConstantEscapeId

declare type Expression =
  | null
  | string
  | number
  | Date
  | Expression[]
  | ConstantExpression
  | ToSql
  | ConstantEscapeValue
  | ConstantEscapeId
  | { [key: string]: Expression }

export function createPoolConnector(options: PoolConfig): PoolConnectorInstance

declare interface PoolConnectorInstance {
  getConnection(): Promise<ConnectorInstance & { release(): void }>
}
