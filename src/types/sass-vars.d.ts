/* eslint-disable */

// Shim for exported Sass variables
declare module '@/assets/styles/_variables.scss' {
  interface sass_vars {
    break_mobile: string;
    nav_height: string;
  };

  const value: sass_vars;
  export default value;
};