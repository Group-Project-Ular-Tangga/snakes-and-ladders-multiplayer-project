const Loader = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      alignItems: 'center'
    }}>
    <h2
      style={{
        color: "#f0f0f0",
      }}>
      Waiting for player
    </h2>
    <span className="svg-spinners--bars-scale"></span>
  </div>
);

export default Loader;
