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
declare type TObj = Record<string, any>;
