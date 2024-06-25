import { useState, useEffect } from "react";
var can=""
export const cancelReason=() => {
  return can
}

function Dialog1({ message, onDialog, nameProduct, id }) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (reason) {
      can=reason
    }
  }, [reason]);
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0,0,0,0.5)"
      }}
      onClick={() => onDialog(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background: "white",
          padding: "20px",
          borderRadius: "10px"
        }}
      >
        <h3 stlye={{ color: "#111", fontSize: "16px" }}>{message}</h3>
        <h1 style={{ color: "#269a85", fontSize: "24px" }}>{nameProduct}</h1>
        <textarea rows="3" cols="70" placeholder="Reason for order cancellation..." value={reason}
          onChange={(e) => setReason(e.target.value)}>
        </textarea><br />
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => onDialog(message, true, nameProduct,id )}
            style={{
              background: "red",
              color: "white",
              padding: "10px",
              marginRight: "4px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Yes
          </button>
          <button
            onClick={() => onDialog(false)}
            style={{
              background: "green",
              color: "white",
              padding: "10px",
              marginLeft: "4px",
              border: "none",
              cursor: "pointer",
              outline: "1px dotted"
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
export default Dialog1;