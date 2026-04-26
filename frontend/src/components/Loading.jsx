export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="loading-text">{message}</p>
    </div>
  );
}
