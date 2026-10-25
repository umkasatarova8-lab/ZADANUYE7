import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import type { Ad, AdsResponse } from './types';
import './App.css';

const API_BASE = 'https://inai-col1.fishrungames.com';

function App() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/ads`);
      const data: AdsResponse = await res.json();
      setAds(data.items);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('price', price);
    if (image) formData.append('image', image);

    try {
      setIsSending(true);
      const res = await fetch(`${API_BASE}/ads`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setPrice('');
        removeImage();
        setNotification('Объявление добавлено!');
        setTimeout(() => setNotification(null), 3000);
        fetchAds();
      } else {
        alert('Ошибка при отправке.');
      }
    } catch (err) {
      alert('Ошибка сети.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="dark-theme-app">
      {notification && <div className="toast-msg">{notification}</div>}

      <header className="top-header">
        <div className="container header-flex">
          <div className="logo-box">
            <span className="logo-accent">//</span> MarketSpace
          </div>
          <div className="stats-box">Актуальных объявлений: <span>{ads.length}</span></div>
        </div>
      </header>

      <main className="container main-layout">
        
        {/* Панель добавления (Сверху) */}
        <section className="create-section">
          <h2 className="section-title">Создать объявление</h2>
          <form onSubmit={submitForm} className="horizontal-form">
            
            <div className="form-col text-inputs">
              <input
                type="text"
                placeholder="Что продаем? (Название)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="cyber-input"
              />
              <textarea
                placeholder="Описание товара и состояние..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                className="cyber-input"
              />
              <input
                type="number"
                step="any"
                placeholder="Цена (сом)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="cyber-input price-input"
              />
            </div>

            <div className="form-col media-inputs">
              {preview ? (
                <div className="preview-container">
                  <img src={preview} alt="Preview" />
                  <button type="button" onClick={removeImage} className="btn-cancel">✖</button>
                </div>
              ) : (
                <label className="file-drop-zone">
                  <span>+ Загрузить фото</span>
                  <input type="file" accept="image/*" onChange={handleFile} hidden />
                </label>
              )}
              <button type="submit" className="btn-action" disabled={isSending}>
                {isSending ? 'Отправка...' : 'Опубликовать'}
              </button>
            </div>
            
          </form>
        </section>

        {/* Лента объявлений (Снизу) */}
        <section className="feed-section">
          {loading ? (
            <div className="grid-layout">
              {[1, 2, 3, 4].map(n => <div key={n} className="skeleton-card"></div>)}
            </div>
          ) : ads.length === 0 ? (
            <div className="empty-state">Пока ничего не продают.</div>
          ) : (
            <div className="grid-layout">
              {ads.map((ad) => (
                <article key={ad.id} className="item-card">
                  <div className="card-img-box">
                    {ad.image_url ? (
                      <img src={`${API_BASE}${ad.image_url}`} alt={ad.title} loading="lazy" />
                    ) : (
                      <div className="placeholder-img">Без фото</div>
                    )}
                    <div className="price-tag">{Number(ad.price).toLocaleString()} ₸</div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{ad.title}</h3>
                    <p className="card-desc">{ad.description}</p>
                    <div className="card-footer">
                      <span className="item-id">ID: {ad.id}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;