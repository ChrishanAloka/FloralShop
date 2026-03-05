import { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { Link } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';
import { formatDate, STATUS_LABELS } from '../../utils/helpers';
import { Icon } from '../common/Icons';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { formatPrice } = useConfig();
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [updating, setUpdating] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const allStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [filterStatus]);

  const fetchOrders = () => {
    setLoading(true);
    orderService.getAll(filterStatus ? { status: filterStatus } : {})
      .then(r => setOrders(r.data)).finally(() => setLoading(false));
  };

  const handleStatusUpdate = async (orderId, status) => {
    const note = prompt('Optional note for customer:');
    setUpdating(orderId);
    try {
      await orderService.updateStatus(orderId, { status, note: note || '' });
      fetchOrders();
    } finally { setUpdating(null); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon.Package size={22} color="var(--rose)" />
          Orders
        </h4>
        <div className="d-flex gap-2 flex-wrap">
          <select className="form-select form-select-sm" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {allStatuses.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" onClick={fetchOrders}>
            <Icon.Refresh size={14} color="var(--rose)" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? <div className="petal-loader"></div> : orders.length === 0 ? (
        <p style={{ color: 'var(--text-light)' }}>No orders found.</p>
      ) : orders.map(order => (
        <div key={order._id} className="bloom-card mb-3 p-3">
          <div className="d-flex justify-content-between flex-wrap gap-2" style={{ cursor: 'pointer' }} onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>#{order._id.slice(-6).toUpperCase()}</span>
                {order.orderType === 'custom-bouquet' && (
                  <span className="badge" style={{ background: 'var(--sage-light)', color: '#3d6b38', fontSize: '0.7rem', fontWeight: 600 }}>Custom</span>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Icon.Clock size={12} color="var(--text-light)" />
                {formatDate(order.createdAt)}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-mid)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="d-flex align-items-center gap-1"><Icon.Person size={13} color="var(--text-mid)" />{order.customerName}</span>
                <span className="d-flex align-items-center gap-1"><Icon.Phone size={13} color="var(--text-mid)" />{order.customerPhone}</span>
              </div>
            </div>
            <div className="text-end d-flex flex-column align-items-end gap-1">
              <span style={{ color: 'var(--rose)', fontWeight: 700, fontSize: '1.1rem' }}>{formatPrice(order.totalAmount)}</span>
              <span className={`status-badge status-${order.status}`}>{STATUS_LABELS[order.status]}</span>
              <Icon.ChevronDown size={14} color="var(--text-light)" style={{ transform: expandedOrder === order._id ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>
          </div>

          {expandedOrder === order._id && (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--champagne)' }}>
              <div style={{ fontSize: '0.83rem', marginBottom: '1rem' }}>
                {order.orderType === 'standard' ? (
                  order.items.map(i => (
                    <div key={i.product} className="d-flex justify-content-between py-1">
                      <span>{i.name} ×{i.quantity}</span>
                      <span style={{ color: 'var(--rose)' }}>{formatPrice(i.price * i.quantity)}</span>
                    </div>
                  ))
                ) : (
                  <>
                    {order.customBouquet?.flowers?.map((f, i) => (
                      <div key={i} className="d-flex justify-content-between py-1">
                        <span>🌸 {f.name} ×{f.quantity}</span>
                        <span style={{ color: 'var(--rose)' }}>{formatPrice(f.pricePerStem * f.quantity)}</span>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between py-1">
                      <span>🎀 {order.customBouquet?.wrapper?.name}</span>
                      <span style={{ color: 'var(--rose)' }}>{formatPrice(order.customBouquet?.wrapper?.price || 0)}</span>
                    </div>
                    {order.customBouquet?.note && (
                      <div className="mt-1 p-2" style={{ background: 'var(--blush-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                        📝 {order.customBouquet.note}
                      </div>
                    )}
                  </>
                )}
                {order.deliveryNote && (
                  <div className="mt-1 p-2" style={{ background: 'var(--champagne)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                    Note: {order.deliveryNote}
                  </div>
                )}
                <div className="mt-3">
                  <Link to={`/invoice/${order._id}`} className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 w-100 justify-content-center" style={{ borderRadius: '20px', fontSize: '0.8rem' }}>
                    <Icon.Download size={14} /> View / Print Invoice
                  </Link>
                </div>
              </div>

              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-mid)' }}>Update Status:</div>
                  <div className="d-flex flex-wrap gap-2">
                    {allStatuses.filter(s => s !== order.status && s !== 'pending').map(s => (
                      <button key={s} className="btn btn-sm" disabled={updating === order._id}
                        style={{ borderRadius: '20px', border: '1.5px solid var(--champagne)', background: 'var(--white)', color: 'var(--text-mid)', fontSize: '0.78rem', padding: '0.25rem 0.7rem' }}
                        onClick={() => handleStatusUpdate(order._id, s)}>
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}