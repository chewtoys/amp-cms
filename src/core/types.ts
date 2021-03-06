import { IncomingHttpHeaders } from "http";
import { User } from "modules/authorization/Users";
import { Pool } from "pg";
import { Readable } from "stream";
import NormalizedURL from "./NormalizedURL";
import {
  IResolvers,
  ITypeDefinitions,
  IDirectiveResolvers,
} from "@graphql-tools/utils";

export type HTTPMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type MaybePromise<T> = Promise<T> | T;

export type Result<T> = MaybePromise<T | ErrorResponse>;

export type LogFunction = (...args: any) => void;

export type APILogger = Record<"error" | "info" | "log" | "warn", LogFunction>;

export type APIContext = {
  db: Pool;
  log?: APILogger;
  cookies?: Record<string, string>;
  token?: string;
  user?: User;
  headers?: IncomingHttpHeaders;
  url?: NormalizedURL;
  ip?: string;
  superuser?: User;
  params: Record<string, string>;
  method: string;
};

export type SimpleType = string | number | boolean | null;

export type GenericResponse = {
  code?: number;
  type?: string;
};

export type ResponseData = string | Readable;

export type ErrorResponse = GenericResponse & {
  errors: Array<Error>;
};

export type AMPResponse = GenericResponse & {
  type: "amp";
  body?: string;
  head?: string;
};
export type JSONObject = Record<string, SimpleType | object | Array<any>>;
export type JSONResponse<T = JSONObject> = GenericResponse & T;
export type DataResponse = GenericResponse & {
  type: string;
  data: ResponseData;
  length: number;
};

export type HTMLResponse = DataResponse & {
  type: "html";
};

export type RouteResponse =
  | ErrorResponse
  | AMPResponse
  | JSONResponse
  | HTMLResponse
  | DataResponse;

export type ResolverFn<P = any, C = any, R extends RouteResponse = any> = (
  params: P,
  context: APIContext & C
) => MaybePromise<R>;

export type Route = ResolverFn | Partial<Record<HTTPMethod, ResolverFn>>;

export type Routes = {
  [path: string]: Route;
};

export type ExcludeReserved<T> = Exclude<T, GenericResponse>;

export type InitializedContext = APIContext &
  Record<string, DataSource> & { params: Record<string, string> };

export type AppModule = {
  dataSources?: Record<string, typeof DataSource>;
  typeDefs?: ITypeDefinitions;
  resolvers?: IResolvers<any, APIContext>;
  directiveResolvers?: IDirectiveResolvers<any, any>;
  routes?: Record<string, Route>;
};

/**
 * DataSource can be anything from an item
 * stored in database to third party service
 */
export abstract class DataSource {
  constructor(protected context: any) {}
}

export type ListParams = {
  offset?: number;
  limit?: number;
  search?: string;
};

export type ItemsList<T> = {
  items: T[];
  nextOffset?: number;
};
