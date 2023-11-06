function MakeFront({ setIsMaking }) {
  const handleImageClick = () => {
    setIsMaking(1);
  };

  return (
    <div>
      <img
        src="img/make_front.png"
        alt="frontimage"
        onClick={handleImageClick}
      />
    </div>
  );
}

export { MakeFront };
