import { useState } from "react";
import Screens from "./Screens";
import { Button } from "antd";

const rectCross = (r1, r2) => {
  if (r1.x + r1.width / 10 <= r2.x || r1.x >= r2.x + r2.width / 10) {
    return false;
  } else if (r1.y + r1.height / 10 <= r2.y || r1.y >= r2.y + r2.height / 10) {
    return false;
  }
  return true;
};

const ScreenSetting = ({
  primaryScreen = [],
  remoteScreens = [],
  updateScreens,
}) => {
  const [edge, setEdge] = useState({
    horizontal: [
      {
        left: 0,
        top: 0,
        width: 0,
      },
    ],
    vertical: [
      {
        left: 0,
        top: 0,
        height: 0,
      },
    ],
  });

  const updatePos = (pos, screenObj) => {
    // primaryScreen.reduce();
    // 判断是否和主控端屏幕位置重叠
    for (const s of screenObj.screens) {
      if (
        primaryScreen.screens.some((p) =>
          rectCross(
            {
              ...s,
              x: s.x / 10 + pos.left,
              y: s.y / 10 + pos.top,
            },
            {
              ...p,
              x: p.x / 10 + primaryScreen.pos.left,
              y: p.y / 10 + primaryScreen.pos.top,
            }
          )
        )
      ) {
        return;
      }
    }

    let hasEdge = false;
    const hranges = [],
      vranges = [];
    const hcoord = [],
      vcoord = [];
    for (const s of screenObj.screens) {
      const s_left = s.x / 10 + pos.left;
      const s_right = s_left + s.width / 10;
      const s_top = s.y / 10 + pos.top;
      const s_bottom = s_top + s.height / 10;
      // console.log("-----", s_left, s_right, s_top, s_bottom);
      for (let i = 0; i < primaryScreen.screens.length; i++) {
        const s1 = primaryScreen.screens[i];
        const left = primaryScreen.pos.left + s1.x / 10;
        const right = left + s1.width / 10;
        const top = primaryScreen.pos.top + s1.y / 10;
        const bottom = top + s1.height / 10;

        // 主屏幕右侧接触
        if (Math.abs(right - s_left) < 1) {
          // 垂直方向对齐
          if (!(bottom < s_top || s_bottom < top)) {
            let range = { top: 0, bottom: 0 };
            // 计算坐标
            if (s_top > top) {
              range.top = s_top;
            } else {
              range.top = top;
            }
            if (s_bottom > bottom) {
              range.bottom = bottom;
            } else {
              range.bottom = s_bottom;
            }
            vranges.push({
              top: range.top,
              left: right,
              height: range.bottom - range.top,
            });
            vcoord.push({
              screen: i,
              start: 10 * (range.top - top),
              end: 10 * (range.bottom - top),
            });
            // console.log(1111, range);
            hasEdge = true;
          }
        }
        // 主屏幕左侧接触
        if (Math.abs(s_right - left) < 1) {
          // 垂直方向对齐
          if (!(bottom < s_top || s_bottom < top)) {
            let range = { top: 0, bottom: 0 };
            // 计算坐标
            if (s_top > top) {
              range.top = s_top;
            } else {
              range.top = top;
            }
            if (s_bottom > bottom) {
              range.bottom = bottom;
            } else {
              range.bottom = s_bottom;
            }
            // console.log(2222, range);
            vranges.push({
              top: range.top,
              left: left,
              height: range.bottom - range.top,
            });
            vcoord.push({
              screen: i,
              start: 10 * (range.top - top),
              end: 10 * (range.bottom - top),
            });
            hasEdge = true;
          }
        }
        // 主屏幕上侧接触
        if (Math.abs(top - s_bottom) < 1) {
          // 垂直方向对齐
          if (!(right < s_left || s_right < left)) {
            let range = { left: 0, right: 0 };
            // 计算坐标
            if (s_left > left) {
              range.left = s_left;
            } else {
              range.left = left;
            }
            if (s_right > right) {
              range.right = right;
            } else {
              range.right = s_right;
            }
            // console.log(1111, range);
            hranges.push({
              top: top,
              left: range.left,
              width: range.right - range.left,
            });
            hcoord.push({
              screen: i,
              start: 10 * (range.left - left),
              end: 10 * (range.right - left),
            });
            hasEdge = true;
          }
        }
        // 主屏幕下侧接触
        if (Math.abs(bottom - s_top) < 1) {
          // 垂直方向对齐
          if (!(right < s_left || s_right < left)) {
            let range = { left: 0, right: 0 };
            // 计算坐标
            if (s_left > left) {
              range.left = s_left;
            } else {
              range.left = left;
            }
            if (s_right > right) {
              range.right = right;
            } else {
              range.right = s_right;
            }
            hranges.push({
              top: bottom,
              left: range.left,
              width: range.right - range.left,
            });
            hcoord.push({
              screen: i,
              start: 10 * (range.left - left),
              end: 10 * (range.right - left),
            });
            // console.log(
            //   "screen",
            //   i,
            //   10 * (range.left - left),
            //   10 * (range.right - left)
            // );
            hasEdge = true;
          }
        }
      }
    }
    console.log(hcoord, vcoord);

    if (!hasEdge) {
      setEdge({
        horizontal: [
          {
            left: 0,
            top: 0,
            width: 0,
          },
        ],
        vertical: [
          {
            left: 0,
            top: 0,
            height: 0,
          },
        ],
      });
    } else {
      setEdge({
        horizontal: hranges,
        vertical: vranges,
      });
    }

    screenObj.pos = pos;
    updateScreens([...remoteScreens]);
  };

  return (
    <div>
      <div className="device">
        <Screens screens={primaryScreen.screens} pos={primaryScreen.pos} />
        {remoteScreens.map((s, idx) => (
          <Screens
            draggable
            screens={s.screens}
            key={idx}
            id={idx + 2}
            pos={s.pos}
            updatePos={(pos) => updatePos(pos, s)}
          />
        ))}
        {edge.horizontal.map((e, i) => {
          return (
            <div
              key={i}
              className="active-edge-horizontal"
              style={{
                left: e.left,
                top: e.top,
                width: e.width,
              }}
            ></div>
          );
        })}
        {edge.vertical.map((e, i) => {
          return (
            <div
              key={i}
              className="active-edge-vertical"
              style={{
                left: e.left,
                top: e.top,
                height: e.height,
              }}
            ></div>
          );
        })}
      </div>
      <Button type="primary">Confirm</Button>
    </div>
  );
};

export default ScreenSetting;
