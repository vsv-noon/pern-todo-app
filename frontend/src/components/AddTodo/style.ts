export const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#fff",
    borderRadius: 8,
    padding: 20,
    width: 420,
    display: "grid",
    gap: 10,
  },

  field: {
    position: "relative",
  },

  suggestions: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#fff",
    border: "1px solid #ddd",
    listStyle: "none",
    padding: 0,
    margin: 0,
    zIndex: 10,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  },

  error: {
    color: "crimson",
  },
  
  hint: {
    fontSize: 12,
    opacity: 0.6,
  },

  suggestionItem: {
    cursor: "pointer",
  }
};