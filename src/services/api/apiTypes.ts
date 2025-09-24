/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  /** @format uuid */
  id?: string;
  firstName?: string;
  lastName?: string;
  /** @format email */
  email?: string;
  contactNumber?: string;
  role?: "ADMIN" | "USER";
  image?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/api";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Express TypeScript API
 * @version 1.0.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @baseUrl /api
 *
 * API documentation for Express TypeScript Boilerplate
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  ai = {
    /**
     * No description
     *
     * @tags AI
     * @name UploadImageCreate
     * @summary Upload an image to generate coin design variants
     * @request POST:/ai/upload-image
     * @secure
     */
    uploadImageCreate: (
      data: {
        /** @format binary */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * URLs of generated coin design variants
           * @minItems 5
           */
          variants?: string[];
        },
        void
      >({
        path: `/ai/upload-image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AI
     * @name GenerateFromPromptCreate
     * @summary Generate coin design variants from text prompt and optional image URL
     * @request POST:/ai/generate-from-prompt
     * @secure
     */
    generateFromPromptCreate: (
      data: {
        /**
         * Text prompt for coin design
         * @minLength 1
         */
        prompt: string;
        /**
         * Optional reference image URL
         * @format uri
         */
        imageUrl?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * URLs of generated coin design variants
           * @minItems 5
           */
          variants?: string[];
        },
        void
      >({
        path: `/ai/generate-from-prompt`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AI
     * @name RegenerateCreate
     * @summary Regenerate coin design variants
     * @request POST:/ai/regenerate
     * @secure
     */
    regenerateCreate: (
      data: {
        /**
         * ID of the design to regenerate
         * @format uuid
         */
        designId: string;
        /** Optional updates for regeneration */
        updates?: object;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * URLs of regenerated coin design variants
           * @minItems 5
           */
          variants?: string[];
        },
        void
      >({
        path: `/ai/regenerate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AI
     * @name CoinSpecificationCreate
     * @summary Save coin specifications (front/back details)
     * @request POST:/ai/coin-specification
     * @secure
     */
    coinSpecificationCreate: (
      data: {
        /**
         * Name of the coin design
         * @minLength 1
         */
        name: string;
        /**
         * URL of front image
         * @format uri
         */
        frontImage?: string;
        /** Description of front side */
        frontDescription?: string;
        /**
         * URL of back image
         * @format uri
         */
        backImage?: string;
        /** Description of back side */
        backDescription?: string;
        /** Material and finish type */
        materialFinish?: string;
        /** Shape of the coin */
        coinShape?: string;
        /** Contrast style */
        contrastStyle?: string;
        /** Level of detail */
        detailLevel?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * URL of generated front design
           * @format uri
           */
          frontImage?: string;
          /**
           * URL of generated back design
           * @format uri
           */
          backImage?: string;
        },
        void
      >({
        path: `/ai/coin-specification`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AI
     * @name PreviewList
     * @summary Preview front and back coin designs
     * @request GET:/ai/preview
     * @secure
     */
    previewList: (
      query: {
        /**
         * ID of the design to preview
         * @format uuid
         */
        designId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * URL of front design
           * @format uri
           */
          frontImage?: string;
          /**
           * URL of back design
           * @format uri
           */
          backImage?: string;
        },
        void
      >({
        path: `/ai/preview`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AI
     * @name SaveDesignCreate
     * @summary Save the final coin design
     * @request POST:/ai/save-design
     * @secure
     */
    saveDesignCreate: (
      data: {
        /**
         * ID of the design to save
         * @format uuid
         */
        designId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** ID of the saved design */
          designId?: string;
          /**
           * URL of front design
           * @format uri
           */
          frontImage?: string;
          /**
           * URL of back design
           * @format uri
           */
          backImage?: string;
        },
        void
      >({
        path: `/ai/save-design`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AI
     * @name SendToDesignerCreate
     * @summary Send coin design to designer with instructions
     * @request POST:/ai/send-to-designer
     * @secure
     */
    sendToDesignerCreate: (
      data: {
        /**
         * ID of the design to send
         * @format uuid
         */
        designId: string;
        /** Instructions for the designer */
        instructions?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** ID of the sent design */
          designId?: string;
          /** Status of the submission (e.g., pending) */
          status?: string;
        },
        void
      >({
        path: `/ai/send-to-designer`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @tags Auth
     * @name SignupCreate
     * @summary Register a new user
     * @request POST:/auth/signup
     * @secure
     */
    signupCreate: (
      data: {
        /** @minLength 2 */
        firstName: string;
        /** @minLength 2 */
        lastName: string;
        /** @format email */
        email: string;
        /**
         * @format password
         * @minLength 8
         */
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          user?: {
            id?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            role?: string;
          };
          accessToken?: string;
          refreshToken?: string;
        },
        void
      >({
        path: `/auth/signup`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name LoginCreate
     * @summary Login user
     * @request POST:/auth/login
     * @secure
     */
    loginCreate: (
      data: {
        /** @format email */
        email: string;
        /** @format password */
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          user?: {
            id?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            role?: string;
          };
          accessToken?: string;
          refreshToken?: string;
        },
        void
      >({
        path: `/auth/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name RefreshTokenCreate
     * @summary Refresh access token
     * @request POST:/auth/refresh-token
     * @secure
     */
    refreshTokenCreate: (
      data: {
        refreshToken: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/auth/refresh-token`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name LogoutCreate
     * @summary Logout user
     * @request POST:/auth/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name VerifyEmailCreate
     * @summary Verify email address
     * @request POST:/auth/verify-email
     * @secure
     */
    verifyEmailCreate: (
      data: {
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/auth/verify-email`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name ForgotPasswordCreate
     * @summary Request password reset
     * @request POST:/auth/forgot-password
     * @secure
     */
    forgotPasswordCreate: (
      data: {
        /** @format email */
        email: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/auth/forgot-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name ResetPasswordCreate
     * @summary Reset password
     * @request POST:/auth/reset-password
     * @secure
     */
    resetPasswordCreate: (
      data: {
        token: string;
        /**
         * @format password
         * @minLength 8
         */
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/auth/reset-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  monitoring = {
    /**
     * No description
     *
     * @tags Monitoring
     * @name MetricsList
     * @summary Get system metrics
     * @request GET:/monitoring/metrics
     * @secure
     */
    metricsList: (params: RequestParams = {}) =>
      this.request<string, void>({
        path: `/monitoring/metrics`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Monitoring
     * @name HealthList
     * @summary Check system health
     * @request GET:/monitoring/health
     * @secure
     */
    healthList: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          status?: string;
          /** @format date-time */
          timestamp?: string;
          uptime?: number;
          memoryUsage?: object;
        },
        any
      >({
        path: `/monitoring/health`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Monitoring
     * @name ReadinessList
     * @summary Check if application is ready to handle traffic
     * @request GET:/monitoring/readiness
     * @secure
     */
    readinessList: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          status?: string;
        },
        any
      >({
        path: `/monitoring/readiness`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Monitoring
     * @name LivenessList
     * @summary Check if application is alive
     * @request GET:/monitoring/liveness
     * @secure
     */
    livenessList: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          status?: string;
        },
        any
      >({
        path: `/monitoring/liveness`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Monitoring
     * @name AlertsCreate
     * @summary Receive alerts from AlertManager
     * @request POST:/monitoring/alerts
     * @secure
     */
    alertsCreate: (
      data: {
        alerts?: object[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/monitoring/alerts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Monitoring
     * @name SimulateErrorList
     * @summary Simulate random errors (for testing)
     * @request GET:/monitoring/simulate-error
     * @secure
     */
    simulateErrorList: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/monitoring/simulate-error`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  api = {
    /**
     * No description
     *
     * @tags Users
     * @name UserList
     * @summary Get all users (Admin only)
     * @request GET:/api/user
     * @secure
     */
    userList: (params: RequestParams = {}) =>
      this.request<User[], void>({
        path: `/api/user`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserCreate
     * @summary Create new user (Admin only)
     * @request POST:/api/user
     * @secure
     */
    userCreate: (
      data: {
        /** @minLength 2 */
        firstName: string;
        /** @minLength 2 */
        lastName: string;
        /** @format email */
        email: string;
        /**
         * @format password
         * @minLength 8
         */
        password: string;
        role?: "ADMIN" | "USER";
        contactNumber?: string;
        image?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/user`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserDetail
     * @summary Get user by ID
     * @request GET:/api/user/{id}
     * @secure
     */
    userDetail: (id: string, params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/api/user/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserPartialUpdate
     * @summary Update user (Admin only)
     * @request PATCH:/api/user/{id}
     * @secure
     */
    userPartialUpdate: (
      id: string,
      data: {
        /** @minLength 2 */
        firstName?: string;
        /** @minLength 2 */
        lastName?: string;
        /** @format email */
        email?: string;
        role?: "ADMIN" | "USER";
        contactNumber?: string;
        image?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/user/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserDelete
     * @summary Delete user (Admin only)
     * @request DELETE:/api/user/{id}
     * @secure
     */
    userDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/user/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserProfileList
     * @summary Retrieve current user's profile
     * @request GET:/api/user/profile
     * @secure
     */
    userProfileList: (params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/api/user/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserProfileUpdate
     * @summary Update user profile
     * @request PUT:/api/user/profile
     * @secure
     */
    userProfileUpdate: (
      data: {
        /** @minLength 2 */
        firstName?: string;
        /** @minLength 2 */
        lastName?: string;
        /** @format email */
        email?: string;
        contactNumber?: string;
        image?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/user/profile`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserPasswordUpdate
     * @summary Change user password
     * @request PUT:/api/user/password
     * @secure
     */
    userPasswordUpdate: (
      data: {
        /** @format password */
        oldPassword: string;
        /**
         * @format password
         * @minLength 8
         */
        newPassword: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/user/password`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
