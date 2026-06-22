import { useState } from 'react';
import { FaIcon } from '../Icons.jsx';
import F from './FormField.jsx';

export default function ListEditor({ items, columns, title, icon, onAdd, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  const reset = () => { setEditing(null); setForm({}); };
  const showError = (msg) => { setError(msg); setTimeout(() => setError(''), 3000); };
  const startEdit = (item) => {
    setEditing(Number(item.id));
    setForm(JSON.parse(JSON.stringify(item)));
  };
  const startAdd = () => {
    const o = {};
    columns.forEach(c => { if (!['id', 'sort_order'].includes(c.key)) o[c.key] = ''; });
    setEditing('new');
    setForm(o);
  };

  const save = async () => {
    try {
      if (editing === 'new') { await onAdd(form); }
      else { await onUpdate(editing, form); }
      reset();
    } catch (err) {
      showError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('确定删除？')) return;
    try {
      await onDelete(id);
      if (editing === id) reset();
    } catch (err) {
      showError(err.message);
    }
  };

  const displayCols = columns.filter(c => !['id', 'sort_order'].includes(c.key));

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>{icon && <span className="admin-hicon-gap"><FaIcon icon={icon} size={15} /> {title}</span>}</h3>
        <button className="admin-btn small" onClick={startAdd}><span className="admin-icon-gap"><FaIcon icon="fa-solid fa-plus" size={12} /> 新增</span></button>
      </div>

      {error && <div className="admin-msg error"><span className="admin-icon-gap"><FaIcon icon="fa-solid fa-circle-exclamation" size={14} />{error}</span></div>}

      {editing && (
        <div className="admin-edit-panel">
          <h4>{editing === 'new' ? '新增' : '编辑'}</h4>
          <div className="admin-form-grid">
            {displayCols.map(c => (
              <F key={c.key} label={c.label} value={form[c.key] || ''} onChange={v => setForm(f => ({ ...f, [c.key]: v }))}
                rows={c.rows} type={c.type} placeholder={c.placeholder} fullWidth={c.fullWidth} />
            ))}
          </div>
          <div className="admin-edit-actions">
            <button className="admin-btn primary" onClick={save}>保存</button>
            <button className="admin-btn" onClick={reset}>取消</button>
          </div>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>{displayCols.map(c => <th key={c.key}>{c.label}</th>)}<th style={{ width: 80 }}>操作</th></tr>
        </thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={displayCols.length + 1} className="admin-empty">暂无数据</td></tr>}
          {items.map(item => (
            <tr key={item.id}>
              {displayCols.map(c => (
                <td key={c.key}>{c.render ? c.render(item[c.key]) : truncate(String(item[c.key] ?? ''), 50)}</td>
              ))}
              <td>
                <button className="admin-btn tiny" onClick={() => startEdit(item)}>编辑</button>
                <button className="admin-btn tiny danger" onClick={() => remove(item.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function truncate(s, n) {
  return s.length > n ? s.slice(0, n) + '…' : s;
}