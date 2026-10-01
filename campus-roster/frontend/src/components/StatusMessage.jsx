export default function StatusMessage({ loading, error, empty, emptyText, onRetry }) {
  if (loading) return <div className="status"><span className="spinner" /> Loading...</div>;
  if (error) {
    return (
      <div className="status error">
        <p>{error}</p>
        <button className="btn ghost" onClick={onRetry}>Retry</button>
      </div>
    );
  }
  if (empty) return <div className="status">{emptyText}</div>;
  return null;
}
