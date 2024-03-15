import type { SkiaSelector, SkiaValue } from "../../../values";
export type SharedValueType<T = number> = {
    value: T;
};
export declare const isValue: (value: unknown) => value is SkiaValue<unknown>;
export declare const isSelector: <T, R>(value: unknown) => value is {
    selector: (v: T) => R;
    value: SkiaValue<T>;
};
export declare const isAnimated: <T>(props: AnimatedProps<T, never>) => boolean;
export type AnimatedProp<T, P = any> = T | SkiaValue<T> | SkiaSelector<T, P> | SharedValueType<T>;
export type AnimatedProps<T, O extends keyof T | never = never> = {
    [K in keyof T]: K extends "children" ? T[K] : K extends O ? T[K] : AnimatedProp<T[K]>;
};
export type SkiaProps<P = object, O extends keyof P | never = never> = AnimatedProps<P, O>;
type WithOptional<T extends object, N extends keyof T> = Omit<T, N> & {
    [K in N]?: T[K];
};
export type SkiaDefaultProps<T extends object, N extends keyof T> = WithOptional<SkiaProps<T>, N>;
export {};
