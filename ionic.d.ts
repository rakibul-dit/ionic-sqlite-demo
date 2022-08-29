// import { HTMLAttributes } from 'react';
// import {
//   defineCustomElements as jeepSqlite,
//   applyPolyfills,
//   JSX as LocalJSX,
// } from 'jeep-sqlite/loader';

// type StencilToReact<T> = {
//   [P in keyof T]?: T[P] &
//     Omit<HTMLAttributes<Element>, 'className'> & {
//       class?: string;
//     };
// };

// declare global {
//   export namespace JSX {
//     interface IntrinsicElements extends StencilToReact<LocalJSX.IntrinsicElements> {}
//   }
// }
