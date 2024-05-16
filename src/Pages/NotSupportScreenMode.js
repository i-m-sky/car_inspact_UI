const NotSupportScreenMode = () => {
  const styles = {
    container: {
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f0f0f0",
      margin: 0,
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    },
    messageContainer: {
      maxWidth: "600px",
      textAlign: "center",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    },
    welcomeContainer: {
      display: "block",
    },
    rotateMessageContainer: {
      display: "none",
    },
    h1: {
      fontSize: "24px",
      color: "#333",
      marginBottom: "20px",
    },
    p: {
      fontSize: "16px",
      color: "#666",
      marginBottom: "30px",
    },
    rotateIcon: {
      fontSize: "48px",
      color: "#f44336",
      marginBottom: "20px",
    },
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.messageContainer}>
          <h1 style={styles.h1}>Please Rotate Your Device</h1>
          <i className="rotate-icon" style={styles.rotateIcon}>
            ↻
          </i>
          <p style={styles.p}>We do not support landscape mode.</p>
        </div>
      </div>
    </>
  );
};

export default NotSupportScreenMode;
