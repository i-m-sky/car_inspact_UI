const DamageDetector = () => {
  return (
    <>
      <div key={index} className="slider text-center">
        <div>
          <span className="img-type">{image.text}</span>
        </div>
        <div id="image-container">
          <img
            id="uploaded-image"
            src={image.url}
            alt="Uploaded Image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => showDrawer(image.text)}
          />
        </div>
      </div>
    </>
  );
};

export default DamageDetector;
