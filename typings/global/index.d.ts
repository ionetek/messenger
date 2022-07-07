declare module '*.jpg';
declare module '*.png';
declare module '*.svg' {
    const content: any;
    export default content;
}

// eslint-disable-next-line no-unused-vars
declare type Nullable<T> = T | null;
// eslint-disable-next-line no-unused-vars
declare type Keys<T extends Record<string, unknown>> = keyof T;
// eslint-disable-next-line no-unused-vars
declare type Values<T extends Record<string, unknown>> = T[Keys<T>];
// eslint-disable-next-line no-unused-vars
declare type TProps = Record<string, any>;
// eslint-disable-next-line no-unused-vars
declare type TObj = Record<string, any> | null;
// eslint-disable-next-line no-unused-vars
declare type TQueryData = Record<string, any>;
// eslint-disable-next-line no-unused-vars
declare type TState = Record<string, any>;
// eslint-disable-next-line no-unused-vars
declare type TAccess = 'public' | 'protected' | '';
// eslint-disable-next-line no-unused-vars
declare type TChatInfo = Record<string, any>;

declare interface IRouterRarams {
    [key: string]: number | null
}

declare interface IQueryOptions {
    headers?: any,
    method?: string,
    data?: any,
    withCredentials?: boolean
}

declare interface IUserInfoData {
    first_name?: string,
    second_name?: string,
    display_name?: string,
    login?: string,
    email?: string,
    phone?: string
}

declare interface IPasswordUpdateData {
    oldPassword?: string,
    newPassword?: string,
}

declare interface ILoginData {
    login?: any,
    password?: any,
}

declare interface IRegistrationData {
    firstName?: string
    secondName?: string
    login?: string
    email?: string
    phone?: string
    password?: string
}

declare interface INewChatData {
    title?: string
}

declare interface IWSOptions {
    userId: number,
    chatId: number,
    token: string
}

declare interface IGetMessagesOptions {
    offset: number
}
