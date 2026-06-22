import { FaIcon } from '../Icons.jsx';

export default function F({ label, value, onChange, type = 'text', placeholder, rows, fullWidth }) {
  const id = label.replace(/\s+/g, '-');
  return (
    <div className="admin-field" style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
      <label htmlFor={id}>{label}</label>
      {rows ? (
        <textarea id={id} value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder || ''} />
      ) : type === 'color' ? (
        <input id={id} type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} className="admin-color-input" />
      ) : type === 'color-text' ? (
        <div className="admin-color-ct">
          <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} className="admin-color-input" />
          <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} />
        </div>
      ) : (
        <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} />
      )}
    </div>
  );
}