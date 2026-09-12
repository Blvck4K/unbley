import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchStoreContact, isStoreRoute } from '../lib/storeContact';

export default function FloatingWhatsApp() {
  const { user } = useAuth();
  const location = useLocation();
  const routeKey = `${location.pathname}${location.search}`;
  const [phoneState, setPhoneState] = useState({ key: '', number: null });
  const [position, setPosition] = useState(null);
  const dragRef = useRef(null);
  const movedRef = useRef(false);
  const isStoreCustomerView = isStoreRoute(location.pathname) && (
    !user || user?.user_metadata?.role === 'customer' || user?.user_metadata?.userType === 'customer'
  );

  useEffect(() => {
    let cancelled = false;
    if (!isStoreCustomerView) return undefined;
    fetchStoreContact(location).then((number) => {
      if (!cancelled) setPhoneState({ key: routeKey, number });
    });
    return () => { cancelled = true; };
  }, [isStoreCustomerView, location, routeKey]);

  if (!isStoreCustomerView || phoneState.key !== routeKey || !phoneState.number) return null;

  const handlePointerDown = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    dragRef.current = { startX: event.clientX, startY: event.clientY, left: bounds.left, top: bounds.top };
    movedRef.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current) return;
    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;
    if (Math.abs(deltaX) < 4 && Math.abs(deltaY) < 4) return;
    movedRef.current = true;
    const size = 46;
    const padding = 12;
    setPosition({
      key: routeKey,
      left: Math.max(padding, Math.min(window.innerWidth - size - padding, dragRef.current.left + deltaX)),
      top: Math.max(padding, Math.min(window.innerHeight - size - padding, dragRef.current.top + deltaY))
    });
  };

  const handlePointerUp = (event) => {
    dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const handleClick = (event) => {
    if (movedRef.current) {
      event.preventDefault();
      movedRef.current = false;
    }
  };

  return (
    <a
      href={`https://wa.me/${phoneState.number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      style={{
        position: 'fixed',
        ...(position?.key === routeKey ? { left: position.left, top: position.top } : { bottom: '24px', right: '20px' }),
        backgroundColor: '#25D366',
        color: '#FFF',
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        zIndex: 10001,
        touchAction: 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
      }}
      aria-label="Chat with this store on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </a>
  );
}
