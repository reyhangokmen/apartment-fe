import React, { useState } from 'react';
import { CheckSquare, Plus, User, Calendar, Trash2 } from 'lucide-react';

export default function Tasks({ tasks, setTasks }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: 'Kapıcı Ahmet',
    priority: 'Orta', // Düşük, Orta, Yüksek
    status: 'Yapılacak' // Yapılacak, Yapılıyor, Tamamlandı
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      assignee: formData.assignee,
      priority: formData.priority,
      status: formData.status,
      date: new Date().toLocaleDateString('tr-TR')
    };

    setTasks(prev => [newTask, ...prev]);
    alert("Yeni görev ataması başarıyla oluşturuldu.");
    setFormData({ title: '', description: '', assignee: 'Kapıcı Ahmet', priority: 'Orta', status: 'Yapılacak' });
    setShowAddForm(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?")) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  // Group tasks by status
  const todoTasks = tasks.filter(t => t.status === 'Yapılacak');
  const inProgressTasks = tasks.filter(t => t.status === 'Yapılıyor');
  const doneTasks = tasks.filter(t => t.status === 'Tamamlandı');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Outfit' }}>Görev & İş Takip Panosu</h3>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> {showAddForm ? 'Kapat' : 'Yeni Görev Ata'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showAddForm ? '3fr 1fr' : '1fr', gap: '20px' }}>
        
        {/* Kanban Board */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          {/* TO DO COLUMN */}
          <div className="glass-panel" style={{ padding: '20px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700' }}>YAPILACAK ({todoTasks.length})</h4>
              <span className="status-badge badge-danger">TO DO</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {todoTasks.map(task => (
                <TaskCard key={task.id} task={task} handleStatusChange={handleStatusChange} handleDelete={handleDelete} />
              ))}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="glass-panel" style={{ padding: '20px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700' }}>YAPILIYOR ({inProgressTasks.length})</h4>
              <span className="status-badge badge-info">IN PROGRESS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} handleStatusChange={handleStatusChange} handleDelete={handleDelete} />
              ))}
            </div>
          </div>

          {/* DONE COLUMN */}
          <div className="glass-panel" style={{ padding: '20px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700' }}>TAMAMLANDI ({doneTasks.length})</h4>
              <span className="status-badge badge-success">DONE</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {doneTasks.map(task => (
                <TaskCard key={task.id} task={task} handleStatusChange={handleStatusChange} handleDelete={handleDelete} />
              ))}
            </div>
          </div>

        </div>

        {/* Add Form Side Panel */}
        {showAddForm && (
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Görev Ataması</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Görev Adı / Başlık</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Temizlik, asansör tamiri vb..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Detaylı Açıklama</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="İşin detayları..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Atanan Personel</label>
                <select 
                  className="form-control"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                >
                  <option value="Kapıcı Ahmet">Kapıcı Ahmet</option>
                  <option value="Tesisatçı Ali">Tesisatçı Ali</option>
                  <option value="Elektrikçi Veli">Elektrikçi Veli</option>
                  <option value="Yönetici Reyhan">Yönetici Reyhan</option>
                </select>
              </div>

              <div className="form-group">
                <label>Öncelik</label>
                <select 
                  className="form-control"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Düşük">Düşük</option>
                  <option value="Orta">Orta</option>
                  <option value="Yüksek">Yüksek</option>
                </select>
              </div>

              <div className="form-group">
                <label>Başlangıç Durumu</label>
                <select 
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Yapılacak">Yapılacak</option>
                  <option value="Yapılıyor">Yapılıyor</option>
                  <option value="Tamamlandı">Tamamlandı</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Görevi Kaydet
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}

// Inner Task Card Component
function TaskCard({ task, handleStatusChange, handleDelete }) {
  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '14px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <span className="status-badge" style={{ 
          background: task.priority === 'Yüksek' ? 'rgba(239, 68, 68, 0.1)' : task.priority === 'Orta' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          color: task.priority === 'Yüksek' ? 'var(--danger)' : task.priority === 'Orta' ? 'var(--warning)' : 'var(--success)',
          fontSize: '9px',
          padding: '2px 6px'
        }}>{task.priority}</span>
        
        <button 
          onClick={() => handleDelete(task.id)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="Sil"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>{task.title}</h5>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>{task.description}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-glass)', paddingTop: '8px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <User size={10} /> {task.assignee}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={10} /> {task.date}
        </span>
      </div>

      {/* Transition triggers */}
      <div style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
        {task.status !== 'Yapılacak' && (
          <button 
            className="btn btn-secondary" 
            style={{ flexGrow: 1, padding: '4px', fontSize: '10px' }}
            onClick={() => handleStatusChange(task.id, task.status === 'Tamamlandı' ? 'Yapılıyor' : 'Yapılacak')}
          >
            ← Geri
          </button>
        )}
        {task.status !== 'Tamamlandı' && (
          <button 
            className="btn btn-secondary" 
            style={{ flexGrow: 1, padding: '4px', fontSize: '10px' }}
            onClick={() => handleStatusChange(task.id, task.status === 'Yapılacak' ? 'Yapılıyor' : 'Tamamlandı')}
          >
            İleri →
          </button>
        )}
      </div>
    </div>
  );
}
