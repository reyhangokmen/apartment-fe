import React, { useState } from 'react';
import { Vote, Plus, BarChart2, CheckSquare } from 'lucide-react';

export default function Surveys({ surveys, setSurveys }) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New survey form states
  const [question, setQuestion] = useState('');
  const [optionsStr, setOptionsStr] = useState('Evet\nHayır');
  const [endDate, setEndDate] = useState('25.07.2026');

  // Voting state (tracking which surveys the current user has voted on)
  const [votedSurveyIds, setVotedSurveyIds] = useState(new Set());

  const handleVote = (surveyId, optionIndex) => {
    if (votedSurveyIds.has(surveyId)) {
      alert("Bu ankete zaten oy verdiniz!");
      return;
    }

    setSurveys(prev => prev.map(s => {
      if (s.id === surveyId) {
        const updatedOptions = [...s.options];
        updatedOptions[optionIndex] = {
          ...updatedOptions[optionIndex],
          votes: updatedOptions[optionIndex].votes + 1
        };
        return {
          ...s,
          options: updatedOptions,
          totalVotes: s.totalVotes + 1
        };
      }
      return s;
    }));

    setVotedSurveyIds(prev => {
      const next = new Set(prev);
      next.add(surveyId);
      return next;
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const optionsArr = optionsStr.split('\n').filter(o => o.trim() !== '').map(text => ({
      text: text.trim(),
      votes: 0
    }));

    if (optionsArr.length < 2) {
      alert("En az 2 seçenek yazmalısınız!");
      return;
    }

    const newSurvey = {
      id: Date.now(),
      question,
      options: optionsArr,
      totalVotes: 0,
      endDate,
      status: 'Aktif'
    };

    setSurveys(prev => [newSurvey, ...prev]);
    setQuestion('');
    setOptionsStr('Evet\nHayır');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Action Header */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Outfit' }}>Karar Alma Anketleri</h3>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> {showAddForm ? 'Kapat' : 'Yeni Anket Düzenle'}
        </button>
      </div>

      <div className="dashboard-sections">
        {/* Surveys Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {surveys.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Vote size={40} style={{ marginBottom: '12px', opacity: '0.5' }} />
              <p>Aktif veya sonlanmış bir anket bulunmuyor.</p>
            </div>
          ) : (
            surveys.map(s => (
              <div key={s.id} className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className={`status-badge ${s.status === 'Aktif' ? 'badge-success' : 'badge-danger'}`}>
                    Anket: {s.status}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Son Katılım: {s.endDate}</span>
                </div>

                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '18px', color: 'var(--text-primary)' }}>
                  {s.question}
                </h4>

                {/* Vote items / progress bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                  {s.options.map((opt, idx) => {
                    const percent = s.totalVotes > 0 ? Math.round((opt.votes / s.totalVotes) * 100) : 0;
                    const hasVoted = votedSurveyIds.has(s.id);
                    
                    return (
                      <div 
                        key={idx} 
                        style={{ position: 'relative', cursor: hasVoted ? 'default' : 'pointer' }}
                        onClick={() => !hasVoted && handleVote(s.id, idx)}
                      >
                        {/* Progress Background bar */}
                        <div style={{ 
                          position: 'absolute', 
                          left: 0, 
                          top: 0, 
                          bottom: 0, 
                          width: `${percent}%`, 
                          background: hasVoted ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)', 
                          borderRadius: '8px', 
                          transition: 'width 0.4s ease-out',
                          pointerEvents: 'none',
                          border: hasVoted ? '1px solid rgba(99, 102, 241, 0.2)' : 'none'
                        }}></div>

                        {/* Label text */}
                        <div style={{ 
                          padding: '12px 16px', 
                          borderRadius: '8px', 
                          border: '1px solid var(--border-glass)', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          fontSize: '14px',
                          position: 'relative',
                          zIndex: 2,
                          transition: 'all 0.2s'
                        }}
                        className={!hasVoted ? 'btn-secondary' : ''}
                        >
                          <span style={{ fontWeight: '500' }}>{opt.text}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {opt.votes} Oy ({percent}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Toplam Katılım: <b>{s.totalVotes} daire</b></span>
                  {votedSurveyIds.has(s.id) && <span style={{ color: 'var(--success)', fontWeight: '600' }}>Oyunuz Kaydedildi</span>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Survey Panel */}
        {showAddForm && (
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', fontFamily: 'Outfit' }}>Yeni Anket Başlat</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Soru / Konu Başlığı</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Apartman sakinlerine ne sormak istersiniz?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Seçenekler (Her satıra bir seçenek yazın)</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Seçenek 1&#10;Seçenek 2&#10;Seçenek 3"
                  value={optionsStr}
                  onChange={(e) => setOptionsStr(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Son Katılım Tarihi</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Anketi Yayına Al
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
