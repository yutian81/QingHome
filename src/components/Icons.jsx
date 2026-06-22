export default function FaIcon({ icon }) {
  if (!icon) return null;
  return <i className={icon} />;
}