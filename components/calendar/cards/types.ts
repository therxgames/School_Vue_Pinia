type TRole = {
  code: string | null,
  name: string | null
}

type TClass = {
  code: string,
  name: string,
  number: number
}

type TEventType = {
  id: number,
  name: string,
  code: string,
}

export type TCardEvent = {
cover: any
[x: string]: any
  id: number,
  roles?: TRole[]
  eventType?: TEventType
  name?: string
  shortName?: string | null
  dateStart?: string
  dateEnd?: string
  timeStart?: string | null
  timeEnd?: string | null
  timezone?: string
  online?: boolean
  courses?: TRole[]
  classes?: TClass[]
  ageFrom?: unknown
  ageTo?: unknown
  hours?: unknown
  createdAt?: string
  updatedAt?: string
  datePublished?: string
  olympiadLevel?: unknown
  favoriteItemId?: unknown
  inMinistryRegister?: boolean
  duration?: unknown
  region?: TRole,
  eventLevel?: TRole
}
