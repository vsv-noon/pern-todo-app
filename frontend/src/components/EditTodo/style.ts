export const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: 8,
    padding: 20,
    width: 420,
    display: 'grid',
    gap: 10,
  },
  row: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
  },
  error: {
    color: 'crimson',
  },
  hint: {
    fontSize: 12,
    opacity: 0.6,
  },
};
