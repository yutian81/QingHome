export function FaIcon({ icon = 'fa-solid fa-circle', size = 20, className = '', ...rest }) {
  return (
    <i
      className={`${icon} ${className}`.trim()}
      style={{ fontSize: typeof size === 'number' ? `${size}px` : size }}
      aria-hidden="true"
      {...rest}
    />
  );
}

export const IconSun      = (p) => <FaIcon icon="fa-solid fa-sun"      {...p} />;
export const IconMoon     = (p) => <FaIcon icon="fa-solid fa-moon"     {...p} />;
export const IconMenu     = (p) => <FaIcon icon="fa-solid fa-bars"     {...p} />;
export const IconClose    = (p) => <FaIcon icon="fa-solid fa-xmark"    {...p} />;
export const IconArrow    = (p) => <FaIcon icon="fa-solid fa-arrow-right"                {...p} />;
export const IconExternal = (p) => <FaIcon icon="fa-solid fa-arrow-up-right-from-square" {...p} />;
export const IconStarFill = (p) => <FaIcon icon="fa-solid fa-star"     {...p} />;
export const IconMail     = (p) => <FaIcon icon="fa-solid fa-envelope" {...p} />;