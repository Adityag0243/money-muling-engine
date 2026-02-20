import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { icon: <CheckCircle size={14} />, color: 'var(--success)', dim: 'var(--success-dim)' },
    error:   { icon: <AlertTriangle size={14} />, color: 'var(--danger)', dim: 'var(--danger-dim)' },
    info:    { icon: <Info size={14} />, color: 'var(--accent)', dim: 'var(--accent-dim)' },
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9998,
        minWidth: '300px',
        maxWidth: '400px',
        background: 'var(--bg-card)',
        border: `1px solid ${config.color}`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.8)`,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 14px',
      }}
    >
      <div style={{
        width: '28px', height: '28px', flexShrink: 0,
        background: config.dim,
        border: `1px solid ${config.color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: config.color,
      }}>
        {config.icon}
      </div>

      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-primary)', flex: 1, lineHeight: 1.5 }}>
        {message}
      </span>

      <button
        onClick={onClose}
        style={{
          width: '22px', height: '22px', flexShrink: 0,
          background: 'transparent',
          border: '1px solid var(--border-base)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-muted)',
          transition: 'all 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
      >
        <X size={12} />
      </button>

      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 3.5, ease: 'linear' }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
          background: config.color, transformOrigin: 'left',
        }}
      />
    </motion.div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const showToast = (message: string, type: ToastType = 'info') => setToast({ message, type });
  const hideToast = () => setToast(null);
  return { toast, showToast, hideToast };
}