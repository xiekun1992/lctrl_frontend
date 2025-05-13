import { useEffect, useState } from "react";

const Screens = ({
  draggable = false,
  screens = [],
  id = 1,
  pos = { top: 0, left: 0 },
  updatePos,
}) => {
  const [dragging, setDragging] = useState(false);

  const onMouseDown = (e) => {
    setDragging(true);
  };
  const onMouseMove = (e) => {
    if (dragging) {
      // console.log(e);
      updatePos?.({
        top: pos.top + e.movementY,
        left: pos.left + e.movementX,
      });
    }
  };
  const onMouseUp = (e) => {
    setDragging(false);
  };

  useEffect(() => {
    // console.log(pos);
  }, [pos]);

  return (
    <div
      style={pos}
      className={`${draggable ? "others screens" : "main screens"}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {screens.map((s, idx) => (
        <div style={{ width: s.width / 10, height: s.height / 10 }} key={idx}>
          {id}
        </div>
      ))}
    </div>
  );
};

export default Screens;
