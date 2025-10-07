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
    securityData: SecurityDataType | null
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
    return `${encodedKey}=${encodeURIComponent(
      typeof value === "number" ? value : `${value}`
    )}`;
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
      (key) => "undefined" !== typeof query[key]
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
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
            : `${property}`
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams
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
    cancelToken: CancelToken
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
      `${baseUrl || this.baseUrl || ""}${path}${
        queryString ? `?${queryString}` : ""
      }`,
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
      }
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
  SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
  aiFlow = {
    /**
     * No description
     *
     * @tags AI
     * @name GenerateCreate
     * @summary Generate coin design variants from text prompt, image file, image URL, or a combination
     * @request POST:/ai-flow/generate
     * @secure
     */
    generateCreate: (
      data: {
        /**
         * ID of the logged-in user. Omit this field for guest users.
         * @format uuid
         */
        userId?: string | null;
        /** Optional text prompt for coin design */
        prompt?: string;
        /**
         * Optional reference image URL
         * @format uri
         */
        imageUrl?: string;
        /**
         * Optional image file for coin design
         * @format binary
         */
        image?: File;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          success?: boolean;
          data?: {
            /** @format uuid */
            designId?: string;
            variants?: string[];
          };
        },
        any
      >({
        path: `/ai-flow/generate`,
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
     * @name UploadImageCreate
     * @summary Upload an image (with optional text prompt) to generate coin design variants
     * @request POST:/ai-flow/upload-image
     * @secure
     */
    uploadImageCreate: (
      data: {
        /**
         * ID of the logged-in user. Omit this field for guest users.
         * @format uuid
         */
        userId?: string | null;
        /**
         * Required image file for coin design.
         * @format binary
         */
        image?: File;
        /** Optional custom text prompt. If not provided, the default predefined prompt will be used. */
        prompt?: string | null;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          [x: string]: any;
          /** @example true */
          success?: boolean;
          data?: {
            /**
             * Generated image buffer (PNG)
             * @format binary
             */
            buffer?: File;
          };
        },
        any
      >({
        path: `/ai-flow/upload-image`,
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
     * @request POST:/ai-flow/generate-from-prompt
     * @secure
     */
    generateFromPromptCreate: (
      data: {
        /** Text prompt for coin design */
        prompt: string;
        /**
         * Optional reference image URL
         * @format uri
         */
        imageUrl?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<{ variants: string[] }, any>({
        path: `/ai-flow/generate-from-prompt`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AI
     * @name RegenerateCreate
     * @summary Regenerate coin design variants
     * @request POST:/ai-flow/regenerate
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
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/ai-flow/regenerate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Both guests and logged-in users can save specifications.
     *
     * @tags AI
     * @name CoinSpecificationCreate
     * @summary Save coin specifications (front/back details)
     * @request POST:/ai-flow/coin-specification
     * @secure
     */
    coinSpecificationCreate: (
      data: {
        /** Name of the coin design */
        name: string;
        /** @format uri */
        frontImage?: string;
        frontDescription?: string;
        /** @format uri */
        backImage?: string;
        backDescription?: string;
        materialFinish?: string;
        coinShape?: string;
        contrastStyle?: string;
        detailLevel?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/ai-flow/coin-specification`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AI
     * @name PreviewList
     * @summary Preview front and back coin designs
     * @request GET:/ai-flow/preview
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
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/ai-flow/preview`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Guests and logged-in users can save designs.
     *
     * @tags AI
     * @name SaveDesignCreate
     * @summary Save the final coin design
     * @request POST:/ai-flow/save-design
     * @secure
     */
    saveDesignCreate: (
      data: {
        /** @format uuid */
        designId: string;
        /** Base64-encoded images selected by the user */
        selectedVariants: string[];
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/ai-flow/save-design`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Guests and logged-in users can send to designer.
     *
     * @tags AI
     * @name SendToDesignerCreate
     * @summary Send coin design to designer with instructions
     * @request POST:/ai-flow/send-to-designer
     * @secure
     */
    sendToDesignerCreate: (
      data: {
        /** @format uuid */
        designId: string;
        /** Instructions for the designer */
        instructions?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/ai-flow/send-to-designer`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
  contact = {
    /**
     * No description
     *
     * @tags Contact
     * @name CreateCreate
     * @summary Create a new contact form entry
     * @request POST:/contact/create
     * @secure
     */
    createCreate: (
      data: {
        /** @example "John" */
        firstName: string;
        /** @example "Doe" */
        lastName: string;
        /** @example "john.doe@example.com" */
        email: string;
        /** @example "+1234567890" */
        contactNumber: string;
        /** @example "Inquiry about product XYZ" */
        description: string;
        /**
         * @format uri
         * @example "https://example.com/profile.jpg"
         */
        image?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          /** @example "5f7a8d88b06c0f3218f9b213" */
          id?: string;
          /** @example "John" */
          firstName?: string;
          /** @example "Doe" */
          lastName?: string;
          /** @example "john.doe@example.com" */
          email?: string;
        },
        void
      >({
        path: `/contact/create`,
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
     * @tags Contact
     * @name UserContactFormList
     * @summary Get contact form submitted by the authenticated user
     * @request GET:/contact/user/contact-form
     * @secure
     */
    userContactFormList: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example "5f7a8d88b06c0f3218f9b213" */
          id?: string;
          /** @example "John" */
          firstName?: string;
          /** @example "Doe" */
          lastName?: string;
          /** @example "john.doe@example.com" */
          email?: string;
        },
        void
      >({
        path: `/contact/user/contact-form`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contact
     * @name AdminContactFormsList
     * @summary Get all contact forms (Admin only)
     * @request GET:/contact/admin/contact-forms
     * @secure
     */
    adminContactFormsList: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example "5f7a8d88b06c0f3218f9b213" */
          id?: string;
          /** @example "John" */
          firstName?: string;
          /** @example "Doe" */
          lastName?: string;
          /** @example "john.doe@example.com" */
          email?: string;
        }[],
        void
      >({
        path: `/contact/admin/contact-forms`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  design = {
    /**
     * No description
     *
     * @tags CoinDesign
     * @name CreateCreate
     * @summary Create a new coin design (with associated quote and optional packaging)
     * @request POST:/design/create
     * @secure
     */
    createCreate: (
      data: {
        /**
         * Name of the coin design (required)
         * @minLength 1
         * @maxLength 100
         */
        name: string;
        /** Design status (used in quote as designStatus) */
        status?: "DRAFT" | "BINGO" | "DESIGNER_REVIEW" | "SUBMITTED";
        /** Total number of coins (used in quote) */
        totalCoins?: number;
        /**
         * Email address for the quote
         * @format email
         */
        email?: string;
        /**
         * Quoted amount for the design
         * @format float
         */
        amount?: number;
        /** Payment method for the quote (required) */
        method: "STRIPE" | "QUICKBOOKS" | "MANUAL";
        /** Feedback related to the quote */
        feedback?: string;
        /** Generator prompt text */
        generatorPrompt?: string;
        /** URL or base64 string for generator image */
        generatorImage?: string;
        /** Instructions for the designer */
        designerInstructions?: string;
        /** The **S3 object key** for the front image of the coin design. Example: "1685900000000_myimage.png" */
        frontImage?: string;
        /** Description for front */
        frontDescription?: string;
        /** Text on front */
        frontText?: string;
        /**
         * Style for front text (max 50 chars)
         * @maxLength 50
         */
        frontTextStyle?: string;
        /** Front reference information */
        frontReference?: string;
        /** Impact of the front reference */
        frontReferenceImpact?: string;
        /** Front composition details */
        frontComposition?: string;
        /** The **S3 object key** for the back image of the coin design. Example: "1685900000001_mybackimage.jpg" */
        backImage?: string;
        /** Description for back */
        backDescription?: string;
        /** Text on back */
        backText?: string;
        /**
         * Style for back text (max 50 chars)
         * @maxLength 50
         */
        backTextStyle?: string;
        /** Back reference information */
        backReference?: string;
        /** Impact of the back reference */
        backReferenceImpact?: string;
        /** Back composition details */
        backComposition?: string;
        /**
         * Shape of the coin (max 50 chars)
         * @maxLength 50
         */
        coinShape?: string;
        /** Subject of the coin design */
        subject?: string;
        /**
         * Material and finish details (max 50 chars)
         * @maxLength 50
         */
        materialFinish?: string;
        /**
         * Contrast style of the design (max 50 chars)
         * @maxLength 50
         */
        contrastStyle?: string;
        /**
         * Level of detail in the design (max 50 chars)
         * @maxLength 50
         */
        detailLevel?: string;
        /** Any prohibited content notes */
        prohibitedContent?: string;
        /**
         * Set to true to include packaging information
         * @default false
         */
        packaging?: boolean;
        /** Packaging description (optional, only used if `packaging` is true) */
        description?: string;
        /** S3 key or image reference for packaging (optional) */
        referenceImg?: string;
        /** Any text to be printed or included in the packaging */
        text?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/design/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags CoinDesign
     * @name GetDesign
     * @summary Get all coin designs for the authenticated user
     * @request GET:/design/all
     * @secure
     */
    getDesign: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/design/all`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags CoinDesign
     * @name DesignDetail
     * @summary Get a coin design by ID
     * @request GET:/design/{id}
     * @secure
     */
    designDetail: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/design/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags CoinDesign
     * @name DesignUpdate
     * @summary Update a coin design
     * @request PUT:/design/{id}
     * @secure
     */
    designUpdate: (
      id: string,
      data: {
        /**
         * Name of the coin design
         * @minLength 1
         * @maxLength 100
         */
        name: string;
        /** Status of the design */
        status?: "DRAFT" | "BINGO" | "DESIGNER_REVIEW";
        /** Total number of coins */
        totalCoins?: number;
        /** Generator prompt text */
        generatorPrompt?: string;
        /** URL or base64 string for generator image */
        generatorImage?: string;
        /** Instructions for the designer */
        designerInstructions?: string;
        /** The **S3 object key** for the front image of the coin design. This key should be obtained from the S3 upload API after successful upload. Example: "1685900000000_myimage.png" */
        frontImage?: string;
        /** Description for front */
        frontDescription?: string;
        /** Text on front */
        frontText?: string;
        /**
         * Style for front text (max 50 chars)
         * @maxLength 50
         */
        frontTextStyle?: string;
        /** Front reference information */
        frontReference?: string;
        /** Impact of the front reference */
        frontReferenceImpact?: string;
        /** Front composition details */
        frontComposition?: string;
        /** The **S3 object key** for the back image of the coin design. This key should be obtained from the S3 upload API after successful upload. Example: "1685900000001_mybackimage.jpg" */
        backImage?: string;
        /** Description for back */
        backDescription?: string;
        /** Text on back */
        backText?: string;
        /**
         * Style for back text (max 50 chars)
         * @maxLength 50
         */
        backTextStyle?: string;
        /** Back reference information */
        backReference?: string;
        /** Impact of the back reference */
        backReferenceImpact?: string;
        /** Back composition details */
        backComposition?: string;
        /**
         * Shape of the coin (max 50 chars)
         * @maxLength 50
         */
        coinShape?: string;
        /** Subject of the coin design */
        subject?: string;
        /**
         * Material and finish details (max 50 chars)
         * @maxLength 50
         */
        materialFinish?: string;
        /**
         * Contrast style of the design (max 50 chars)
         * @maxLength 50
         */
        contrastStyle?: string;
        /**
         * Level of detail in the design (max 50 chars)
         * @maxLength 50
         */
        detailLevel?: string;
        /** Any prohibited content notes */
        prohibitedContent?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/design/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags CoinDesign
     * @name DesignDelete
     * @summary Delete a coin design
     * @request DELETE:/design/{id}
     * @secure
     */
    designDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/design/${id}`,
        method: "DELETE",
        secure: true,
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
      params: RequestParams = {}
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
  order = {
    /**
     * No description
     *
     * @tags Order
     * @name CreateCreate
     * @summary Create a new order
     * @request POST:/order/create
     * @secure
     */
    createCreate: (
      data: {
        /** @example "ORD12345" */
        orderId?: string;
        /** @example "FedEx" */
        carrier?: string;
        /** @example "APPROVED" */
        status?: "PENDING" | "APPROVED" | "CANCELLED" | "COMPLETED";
        /** @example 1.5 */
        weight?: number;
        /** @example 100 */
        totalCoins?: number;
        /** @example 299.99 */
        totalPrice?: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/order/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name UserList
     * @summary Get all orders of the authenticated user
     * @request GET:/order/user
     * @secure
     */
    userList: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/order/user`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderDetail
     * @summary Get an order by ID (authenticated user)
     * @request GET:/order/{orderId}
     * @secure
     */
    orderDetail: (orderId: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/order/${orderId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name AdminAllList
     * @summary (Admin) Get all orders
     * @request GET:/order/admin/all
     * @secure
     */
    adminAllList: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/order/admin/all`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name AdminStatusPartialUpdate
     * @summary (Admin) Update order status
     * @request PATCH:/order/admin/{orderId}/status
     * @secure
     */
    adminStatusPartialUpdate: (
      orderId: string,
      data: {
        /** @example "COMPLETED" */
        status: "PENDING" | "APPROVED" | "CANCELLED" | "COMPLETED";
      },
      params: RequestParams = {}
    ) =>
      this.request<void, void>({
        path: `/order/admin/${orderId}/status`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  package = {
    /**
     * No description
     *
     * @tags package
     * @name UserDetail
     * @summary Get a package by ID (authenticated user)
     * @request GET:/package/user/{packageId}
     * @secure
     */
    userDetail: (packageId: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/package/user/${packageId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags package
     * @name PackageDetail
     * @summary Get any package by ID (admin only)
     * @request GET:/package/{packageId}
     * @secure
     */
    packageDetail: (packageId: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/package/${packageId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  quote = {
    /**
     * No description
     *
     * @tags Quote
     * @name UserDetail
     * @summary Get a single quote of the authenticated user
     * @request GET:/quote/user/{id}
     * @secure
     */
    userDetail: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/quote/user/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Quote
     * @name UserList
     * @summary Get all quotes of authenticated user
     * @request GET:/quote/user
     * @secure
     */
    userList: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/quote/user`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Quote
     * @name AdminList
     * @summary (Admin) Get all quotes
     * @request GET:/quote/admin
     * @secure
     */
    adminList: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/quote/admin`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Quote
     * @name AdminDetail
     * @summary (Admin) Get a single quote by ID
     * @request GET:/quote/admin/{id}
     * @secure
     */
    adminDetail: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/quote/admin/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Quote
     * @name AdminDelete
     * @summary (Admin) Delete a quote
     * @request DELETE:/quote/admin/{id}
     * @secure
     */
    adminDelete: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          success?: boolean;
          message?: string;
        },
        void
      >({
        path: `/quote/admin/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Quote
     * @name AdminApproveCreate
     * @summary (Admin) Approve a quote and create an order
     * @request POST:/quote/admin/{id}/approve
     * @secure
     */
    adminApproveCreate: (
      id: string,
      data: {
        /**
         * The amount to be approved for the quote
         * @example 199.99
         */
        amount?: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          success?: boolean;
          message?: string;
          /** The updated quote with linked order */
          data?: object;
        },
        void
      >({
        path: `/quote/admin/${id}/approve`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  s3 = {
    /**
     * No description
     *
     * @tags S3
     * @name UploadUrlCreate
     * @summary Get a presigned URL for uploading a file to S3
     * @request POST:/s3/upload-url
     * @secure
     */
    uploadUrlCreate: (
      data: {
        /** @example "image.png" */
        fileName: string;
        /** @example "image/png" */
        mimeType: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          /** The presigned upload URL */
          url?: string;
          /** The S3 object key */
          key?: string;
        },
        void
      >({
        path: `/s3/upload-url`,
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
     * @tags S3
     * @name RetrieveUrlDetail
     * @summary Get a presigned URL for downloading a file from S3
     * @request GET:/s3/retrieve-url/{fileName}
     * @secure
     */
    retrieveUrlDetail: (fileName: string, params: RequestParams = {}) =>
      this.request<
        {
          /** The presigned download URL */
          url?: string;
        },
        void
      >({
        path: `/s3/retrieve-url/${fileName}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags S3
     * @name DeleteFileDelete
     * @summary Delete a file from S3 by key
     * @request DELETE:/s3/delete-file
     * @secure
     */
    deleteFileDelete: (
      data: {
        /**
         * The S3 object key to delete
         * @example "1609459200000_image.png"
         */
        key: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          /** @example "File deleted successfully" */
          message?: string;
        },
        void
      >({
        path: `/s3/delete-file`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
