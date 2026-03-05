import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useConfig } from '../context/ConfigContext';
import { formatDate } from '../utils/helpers';
import { Icon } from '../components/common/Icons';
import Logo from '../assets/logo.png';

export default function InvoicePage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { formatPrice } = useConfig();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        orderService.getById(orderId)
            .then(res => setOrder(res.data))
            .catch(err => {
                console.error('Error fetching order:', err);
                setError(err.response?.data?.message || 'Order could not be retrieved');
                setOrder(null);
            })
            .finally(() => setLoading(false));
    }, [orderId]);

    if (loading) return <div className="petal-loader" style={{ minHeight: '80vh' }}></div>;
    if (!order) return (
        <div className="container py-5 text-center">
            <Icon.Warning size={48} color="var(--rose)" />
            <h3 className="mt-3">{error === 'Access denied' ? 'Access Denied' : 'Order Not Found'}</h3>
            <p>{error || "We couldn't find the order you're looking for."}</p>
            <div className="mt-2 text-muted" style={{ fontSize: '0.7rem' }}>Order ID: {orderId || 'missing'}</div>
            <button className="btn btn-primary mt-4" onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );



    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="invoice-wrapper py-5">
            <div className="container">
                {/* Action Buttons (Hidden during print) */}
                <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
                    <button className="btn btn-link text-decoration-none d-flex align-items-center gap-2" onClick={() => navigate(-1)} style={{ color: 'var(--text-mid)' }}>
                        <Icon.ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back
                    </button>
                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handlePrint}>
                        <Icon.Download size={18} /> Print Invoice
                    </button>
                </div>

                {/* Invoice Paper */}
                <div className="invoice-container shadow-sm p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '800px', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>

                    {/* Decorative Floral Header */}
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
                        <Icon.Bouquet size={200} />
                    </div>

                    <div className="row mb-5">
                        <div className="col-sm-6">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <img src={Logo} alt="Logo" style={{ height: '40px' }} />
                                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--rose)', margin: 0 }}>Bloom & Petal</h2>
                            </div>
                            <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                                123 Flower Lane, Colombo 07<br />
                                Sri Lanka<br />
                                Phone: +94 11 234 5678<br />
                                Email: hello@bloomandpetal.com
                            </p>
                        </div>
                        <div className="col-sm-6 text-sm-end mt-4 mt-sm-0">
                            <h1 className="h3 text-uppercase fw-bold mb-1" style={{ letterSpacing: '2px', color: 'var(--text-dark)' }}>Invoice</h1>
                            <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                                Order #{order._id.slice(-6).toUpperCase()}<br />
                                Date: {formatDate(order.createdAt)}
                            </div>
                        </div>
                    </div>

                    <hr style={{ borderTop: '2px solid var(--blush-light)', opacity: 1 }} />

                    <div className="row mb-5 mt-4">
                        <div className="col-sm-6">
                            <h6 className="text-uppercase text-muted fw-bold mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Bill To:</h6>
                            <div style={{ color: 'var(--text-dark)' }}>
                                <h5 className="mb-1">{order.customerName}</h5>
                                <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                                    <Icon.Phone size={14} className="me-2" color="var(--text-light)" /> {order.customerPhone}
                                </p>
                                {order.customer?.email && (
                                    <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                                        <Icon.Envelope size={14} className="me-2" color="var(--text-light)" /> {order.customer.email}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-6 text-sm-end mt-4 mt-sm-0">
                            <h6 className="text-uppercase text-muted fw-bold mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Order Details:</h6>
                            <div style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>
                                <p className="mb-1"><strong>Status:</strong> <span className={`status-badge status-${order.status}`}>{order.status.toUpperCase()}</span></p>
                                <p className="mb-1"><strong>Type:</strong> {order.orderType === 'custom-bouquet' ? 'Custom Bouquet' : 'Standard Order'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive mb-5">
                        <table className="table table-borderless">
                            <thead style={{ background: 'var(--blush-light)', color: 'var(--text-dark)' }}>
                                <tr>
                                    <th className="py-3 ps-3">Item Description</th>
                                    <th className="py-3 text-center">Qty</th>
                                    <th className="py-3 text-end pe-3">Price</th>
                                    <th className="py-3 text-end pe-3">Total</th>
                                </tr>
                            </thead>
                            <tbody style={{ borderBottom: '1px solid var(--champagne)' }}>
                                {order.orderType === 'standard' ? (
                                    order.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-3 ps-3">
                                                <div className="fw-bold">{item.name}</div>
                                            </td>
                                            <td className="py-3 text-center">{item.quantity}</td>
                                            <td className="py-3 text-end pe-3">{formatPrice(item.price)}</td>
                                            <td className="py-3 text-end pe-3 fw-bold">{formatPrice(item.price * item.quantity)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <>
                                        {order.customBouquet?.flowers?.map((f, idx) => (
                                            <tr key={idx}>
                                                <td className="py-3 ps-3">
                                                    <div className="fw-bold">🌸 {f.name}</div>
                                                </td>
                                                <td className="py-3 text-center">{f.quantity}</td>
                                                <td className="py-3 text-end pe-3">{formatPrice(f.pricePerStem)}</td>
                                                <td className="py-3 text-end pe-3 fw-bold">{formatPrice(f.pricePerStem * f.quantity)}</td>
                                            </tr>
                                        ))}
                                        {order.customBouquet?.wrapper && (
                                            <tr>
                                                <td className="py-3 ps-3">
                                                    <div className="fw-bold">🎀 {order.customBouquet.wrapper.name}</div>
                                                </td>
                                                <td className="py-3 text-center">1</td>
                                                <td className="py-3 text-end pe-3">{formatPrice(order.customBouquet.wrapper.price)}</td>
                                                <td className="py-3 text-end pe-3 fw-bold">{formatPrice(order.customBouquet.wrapper.price)}</td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="row justify-content-end">
                        <div className="col-sm-5">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span className="fw-bold text-dark">{formatPrice(order.totalAmount)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Tax (0%)</span>
                                <span className="fw-bold text-dark">{formatPrice(0)}</span>
                            </div>
                            <div className="d-flex justify-content-between pt-3 align-items-center" style={{ borderTop: '2px solid var(--rose)' }}>
                                <h4 className="mb-0 fw-bold" style={{ color: 'var(--text-dark)' }}>Total Amount</h4>
                                <h3 className="mb-0 fw-bold" style={{ color: 'var(--rose)' }}>{formatPrice(order.totalAmount)}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 pt-5">
                        <div className="p-3" style={{ background: 'var(--ivory)', borderRadius: '8px', borderLeft: '4px solid var(--rose)' }}>
                            <h6 className="fw-bold mb-2" style={{ color: 'var(--text-dark)' }}>Notes & Instructions:</h6>
                            <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                                {order.deliveryNote || 'Thank you for choosing Bloom & Petal! We hope these flowers bring joy to your day.'}
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-5 text-muted" style={{ fontSize: '0.8rem' }}>
                        <p className="mb-1">This is a computer-generated invoice and doesn't require a signature.</p>
                        <p>&copy; {new Date().getFullYear()} Bloom & Petal Floral Shop. All rights reserved.</p>
                    </div>
                </div>
            </div>

            <style>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          html, body { 
            width: 210mm;
            height: 297mm;
            margin: 0 !important; 
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .invoice-wrapper { 
            padding: 0 !important; 
            margin: 0 !important;
          }
          .invoice-container { 
            box-shadow: none !important; 
            border: none !important; 
            margin: 0 !important; 
            width: 100% !important; 
            max-width: 100% !important; 
            padding: 10mm !important; /* Minimal internal padding for content safety */
            border-radius: 0 !important;
            min-height: 297mm;
          }
          .d-print-none { 
            display: none !important; 
          }
          
          /* Smaller fonts for compact A4 fit */
          h1 { font-size: 1.5rem !important; }
          h2 { font-size: 1.3rem !important; }
          h3 { font-size: 1.1rem !important; }
          h4 { font-size: 0.95rem !important; }
          p, td, th, span, div { font-size: 0.8rem !important; }
          
          .table th { padding: 6px !important; background: var(--blush-light) !important; }
          .table td { padding: 4px !important; }
          
          .table, .row, .p-3 { page-break-inside: avoid; }
        }
        
        .status-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-pending { background: #fff8e6; color: #856404; }
        .status-confirmed { background: #e7f3ff; color: #004085; }
        .status-preparing { background: #f3e5f5; color: #7b1fa2; }
        .status-ready { background: #e8f5e9; color: #2e7d32; }
        .status-delivered { background: #f0fff4; color: #3d6b38; }
        .status-cancelled { background: #fff5f5; color: #d4637a; }
      `}</style>
        </div>
    );
}
