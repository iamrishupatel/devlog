const PopConfirm = ({ heading, description, onClose, onConfirm }) => {
  return (
    <div className="card">
      <h1>{heading}</h1>
      <p>{description}</p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button className="btn-green" onClick={onClose}>
          No
        </button>
        <button
          className="btn-red"
          onClick={async () => {
            await onConfirm();
            onClose();
          }}
        >
          Yes, Delete it!
        </button>
      </div>
    </div>
  );
};

export default PopConfirm;
