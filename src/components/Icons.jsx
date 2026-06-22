/**
 * 图标库 —— 基于 Font Awesome 6（CDN 加载）
 *
 * 两种使用方式：
 * 1. <FaIcon icon="fa-solid fa-star" /> — 数据驱动，传完整 class
 * 2. 具名导出：<IconArrow /> <IconExternal /> 等
 */

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

function Fa({ icon, size = 20, className = '', ...rest }) {
  return (
    <i
      className={`fa-solid fa-${icon} ${className}`.trim()}
      style={{ fontSize: typeof size === 'number' ? `${size}px` : size }}
      aria-hidden="true"
      {...rest}
    />
  );
}

export const IconSun      = (p) => <Fa icon="sun"      {...p} />;
export const IconMoon     = (p) => <Fa icon="moon"     {...p} />;
export const IconMenu     = (p) => <Fa icon="bars"     {...p} />;
export const IconClose    = (p) => <Fa icon="xmark"    {...p} />;
export const IconArrow    = (p) => <Fa icon="arrow-right"                {...p} />;
export const IconExternal = (p) => <Fa icon="arrow-up-right-from-square" {...p} />;
export const IconStarFill = (p) => <Fa icon="star"     {...p} />;
export const IconMail     = (p) => <Fa icon="envelope" {...p} />;