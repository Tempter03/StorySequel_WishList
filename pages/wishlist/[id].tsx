import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Wishlist } from '@/types';

export default function WishlistPage() {
  const router = useRouter();
  const { id } = router.query;
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservingItem, setReservingItem] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [showReserveForm, setShowReserveForm] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchWishlist();
      setShareUrl(window.location.href);
    }
  }, [id]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`/api/wishlist/${id}`);
      const data = await response.json();

      if (data.success) {
        setWishlist(data.wishlist);
      } else {
        setError(data.error || 'Карта желаний не найдена');
      }
    } catch (err) {
      setError('Не удалось загрузить карту желаний');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (itemId: string) => {
    if (!guestName.trim()) {
      alert('Пожалуйста, введите ваше имя');
      return;
    }

    setReservingItem(itemId);

    try {
      const response = await fetch('/api/wishlist/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wishlistId: id,
          itemId,
          reservedBy: guestName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setWishlist(data.wishlist);
        setShowReserveForm(null);
        setGuestName('');
      } else {
        alert(data.error || 'Не удалось зарезервировать букет');
      }
    } catch (err) {
      alert('Произошла ошибка. Попробуйте снова.');
      console.error(err);
    } finally {
      setReservingItem(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Загрузка карты желаний...</p>
        </div>
      </div>
    );
  }

  if (error || !wishlist) {
    return (
      <div className="container">
        <div className="error">
          <h2>😔 Ошибка</h2>
          <p>{error || 'Карта желаний не найдена'}</p>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/')}
            style={{ marginTop: '20px' }}
          >
            Создать новую карту
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header fade-in">
        <h1>🌸 Карта желаний</h1>
        <p>от {wishlist.creatorName}</p>
      </header>

      <div className="share-section fade-in">
        <h2>📤 Поделиться картой</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Скопируйте ссылку и отправьте тем, кто хочет порадовать вас цветами
        </p>
        <div className="share-link">{shareUrl}</div>
        <button className="btn btn-success" onClick={copyToClipboard}>
          {copied ? '✅ Скопировано!' : '📋 Копировать ссылку'}
        </button>
      </div>

      <div className="card fade-in" style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#333', fontSize: '1.5rem' }}>
          Желаемые букеты
        </h2>

        {wishlist.items.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
            В карте желаний пока нет букетов
          </p>
        ) : (
          <div className="wishlist-items">
            {wishlist.items.map((item) => (
              <div
                key={item.id}
                className={`wishlist-item ${item.reserved ? 'reserved' : ''}`}
              >
                <div className="wishlist-item-header">
                  <div>
                    <div className="wishlist-item-title">{item.bouquetName}</div>
                    <div className="wishlist-item-date">
                      📅 {formatDate(item.date)}
                    </div>
                    {item.notes && (
                      <div className="wishlist-item-notes">
                        💭 {item.notes}
                      </div>
                    )}
                  </div>
                  <div>
                    {item.reserved ? (
                      <div className="reserved-badge">
                        ✅ Забронировано{item.reservedBy && `: ${item.reservedBy}`}
                      </div>
                    ) : showReserveForm === item.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '200px' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Ваше имя"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          style={{ fontSize: '0.9rem', padding: '8px 12px' }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleReserve(item.id)}
                            disabled={reservingItem === item.id}
                          >
                            {reservingItem === item.id ? 'Бронируем...' : 'Подтвердить'}
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              setShowReserveForm(null);
                              setGuestName('');
                            }}
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowReserveForm(item.id)}
                      >
                        🎁 Я подарю
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card fade-in" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8f0 100%)' }}>
        <h3 style={{ marginBottom: '15px', color: '#f5576c', fontSize: '1.2rem' }}>
          🛍️ Как заказать букет?
        </h3>
        <ol style={{ paddingLeft: '20px', color: '#666', lineHeight: '1.8' }}>
          <li>Нажмите "Я подарю" на понравившемся букете</li>
          <li>Укажите ваше имя, чтобы забронировать букет</li>
          <li>Перейдите в <a href="https://storysequel.tilda.ws/fandb" target="_blank" rel="noopener noreferrer" style={{ color: '#f5576c', fontWeight: '600' }}>магазин StorySequel</a></li>
          <li>Оформите заказ на выбранный букет</li>
          <li>Укажите желаемую дату доставки при оформлении</li>
        </ol>
      </div>

      <footer className="footer">
        <p>
          <a href="https://storysequel.tilda.ws/fandb" target="_blank" rel="noopener noreferrer">
            🌺 Перейти в магазин StorySequel
          </a>
        </p>
        <p style={{ marginTop: '10px', fontSize: '0.85rem' }}>
          <a href="/" style={{ color: '#999' }}>
            Создать свою карту желаний
          </a>
        </p>
      </footer>
    </div>
  );
}

