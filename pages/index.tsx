import { useState } from 'react';
import { useRouter } from 'next/router';

interface WishlistItemForm {
  bouquetName: string;
  date: string;
  notes: string;
}

export default function Home() {
  const router = useRouter();
  const [creatorName, setCreatorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [items, setItems] = useState<WishlistItemForm[]>([
    { bouquetName: '', date: '', notes: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addItem = () => {
    setItems([...items, { bouquetName: '', date: '', notes: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof WishlistItemForm, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!creatorName.trim()) {
      setError('Пожалуйста, введите ваше имя');
      return;
    }

    const validItems = items.filter(item => item.bouquetName.trim() && item.date);
    
    if (validItems.length === 0) {
      setError('Добавьте хотя бы один букет с датой');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/wishlist/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorName,
          creatorEmail: creatorEmail || undefined,
          items: validItems,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/wishlist/${data.wishlistId}`);
      } else {
        setError(data.error || 'Не удалось создать карту желаний');
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header fade-in">
        <h1>🌸 Карта желаний</h1>
        <p>Создайте список желаемых букетов и поделитесь им с близкими</p>
      </header>

      <div className="card fade-in">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ваше имя *</label>
            <input
              type="text"
              className="form-input"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="Введите ваше имя"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email (необязательно)</label>
            <input
              type="email"
              className="form-input"
              value={creatorEmail}
              onChange={(e) => setCreatorEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <hr style={{ margin: '30px 0', border: 'none', borderTop: '2px solid #f0f0f0' }} />

          <h2 style={{ marginBottom: '20px', color: '#333', fontSize: '1.5rem' }}>
            Добавьте желаемые букеты
          </h2>

          <div className="wishlist-items">
            {items.map((item, index) => (
              <div key={index} className="wishlist-item">
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Название букета *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={item.bouquetName}
                      onChange={(e) => updateItem(index, 'bouquetName', e.target.value)}
                      placeholder="Например: Букет роз 'Романтика'"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Желаемая дата *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={item.date}
                      onChange={(e) => updateItem(index, 'date', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Пожелания (необязательно)</label>
                  <textarea
                    className="form-textarea"
                    value={item.notes}
                    onChange={(e) => updateItem(index, 'notes', e.target.value)}
                    placeholder="Дополнительные пожелания или комментарии..."
                  />
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(index)}
                  >
                    Удалить
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-outline btn-block"
            onClick={addItem}
            style={{ marginBottom: '20px' }}
          >
            ➕ Добавить ещё букет
          </button>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Создаём...' : '✨ Создать карту желаний'}
          </button>
        </form>
      </div>

      <footer className="footer">
        <p>
          <a href="https://storysequel.tilda.ws/fandb" target="_blank" rel="noopener noreferrer">
            Перейти в магазин StorySequel
          </a>
        </p>
      </footer>
    </div>
  );
}

