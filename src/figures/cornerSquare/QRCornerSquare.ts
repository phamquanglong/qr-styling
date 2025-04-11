import cornerSquareTypes from "../../constants/cornerSquareTypes";
import { CornerSquareType, DrawArgs, BasicFigureDrawArgs, RotateFigureArgs, Window } from "../../types";

export const availableCornerSquareTypes = Object.values(cornerSquareTypes);

export default class QRCornerSquare {
  _element?: SVGElement;
  _svg: SVGElement;
  _type: CornerSquareType;
  _window: Window;

  constructor({ svg, type, window }: { svg: SVGElement; type: CornerSquareType; window: Window }) {
    this._svg = svg;
    this._type = type;
    this._window = window;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerSquareTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerSquareTypes.extraRounded:
        drawFunction = this._drawExtraRounded;
        break;
      case cornerSquareTypes.dot:
        drawFunction = this._drawDot;
        break;
      case cornerSquareTypes.style_2:
        drawFunction = this._drawStyle2;
        break;
      case cornerSquareTypes.style_3:
        drawFunction = this._drawStyle3;
        break;
      case cornerSquareTypes.style_4:
        drawFunction = this._drawStyle4;
        break;
      default:
        drawFunction = this._drawDot;
        break;
    }

    drawFunction.call(this, { x, y, size, rotation });
  }

  _rotateFigure({ x, y, size, rotation = 0, draw }: RotateFigureArgs): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    draw();
    this._element?.setAttribute("transform", `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`);
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x + size / 2} ${y}` + // M cx, y //  Move to top of ring
            `a ${size / 2} ${size / 2} 0 1 0 0.1 0` + // a outerRadius, outerRadius, 0, 1, 0, 1, 0 // Draw outer arc, but don't close it
            `z` + // Z // Close the outer shape
            `m 0 ${dotSize}` + // m -1 outerRadius-innerRadius // Move to top point of inner radius
            `a ${size / 2 - dotSize} ${size / 2 - dotSize} 0 1 1 -0.1 0` + // a innerRadius, innerRadius, 0, 1, 1, -1, 0 // Draw inner arc, but don't close it
            `Z` // Z // Close the inner ring. Actually will still work without, but inner ring will have one unit missing in stroke
        );
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` +
            `v ${size}` +
            `h ${size}` +
            `v ${-size}` +
            `z` +
            `M ${x + dotSize} ${y + dotSize}` +
            `h ${size - 2 * dotSize}` +
            `v ${size - 2 * dotSize}` +
            `h ${-size + 2 * dotSize}` +
            `z`
        );
      }
    });
  }

  _basicExtraRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y + 2.5 * dotSize}` +
            `v ${2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${dotSize * 2.5}` +
            `h ${2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${-dotSize * 2.5}` +
            `v ${-2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${-dotSize * 2.5}` +
            `h ${-2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${dotSize * 2.5}` +
            `M ${x + 2.5 * dotSize} ${y + dotSize}` +
            `h ${2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${dotSize * 1.5}` +
            `v ${2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${dotSize * 1.5}` +
            `h ${-2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${-dotSize * 1.5}` +
            `v ${-2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${-dotSize * 1.5}`
        );
      }
    });
  }

  _basicStyle2(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;
    const rOuter = 2.5 * dotSize;
    const lOuter = size - 2 * rOuter;
    const rInner = 1.5 * dotSize;
    const lInner = 2 * dotSize;
    const innerOffsetX = dotSize;
    const innerOffsetY = dotSize;
    const innerStartX = x + innerOffsetX + rInner;
    const innerStartY = y + innerOffsetY;
    this._rotateFigure({
      ...args,
      draw: () => {
    const d =
        `M ${x} ${y + rOuter}` +
        `v ${lOuter}` +
        `a ${rOuter} ${rOuter} 0 0 0 ${rOuter} ${rOuter}` +
        `h ${lOuter}` +
        `L ${x + size} ${y + size}` +
        `L ${x + size} ${y + rOuter}` +
        `a ${rOuter} ${rOuter} 0 0 0 ${-rOuter} ${-rOuter}` +
        `h ${-lOuter}` +
        `a ${rOuter} ${rOuter} 0 0 0 ${-rOuter} ${rOuter}` +
        ` Z ` +
        `M ${innerStartX} ${innerStartY}` +
        `h ${lInner}` +
        `a ${rInner} ${rInner} 0 0 1 ${rInner} ${rInner}` +
        `v ${lInner}` +
        `a ${rInner} ${rInner} 0 0 1 ${-rInner} ${rInner}` +
        `h ${-lInner}` +
        `a ${rInner} ${rInner} 0 0 1 ${-rInner} ${-rInner}` +
        `v ${-lInner}` +
        `a ${rInner} ${rInner} 0 0 1 ${rInner} ${-rInner}` +
        ` Z`;
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          d
        );
      }
    });
  }

  _basicStyle3(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;
    const rOuter = 2.5 * dotSize;
    const lOuter = size - 2 * rOuter;
    const rInner = 1.5 * dotSize;
    const lInner = 2 * dotSize;
    const innerOffsetX = dotSize;
    const innerOffsetY = dotSize;
    const innerStartX = x + innerOffsetX + rInner;
    const innerStartY = y + innerOffsetY;
    this._rotateFigure({
      ...args,
      draw: () => {
        const d =
        `M ${x} ${y + rOuter}` +
        `L ${x} ${y}` +
        `L ${x + rOuter} ${y}` +
        `h ${lOuter}` +
        `a ${rOuter} ${rOuter} 0 0 1 ${rOuter} ${rOuter}` +
        `v ${lOuter}` +
        `L ${x + size} ${y + size}` +
        `L ${x + size - rOuter} ${y + size}` +
        `h ${-lOuter}` +
        `a ${rOuter} ${rOuter} 0 0 1 ${-rOuter} ${-rOuter}` +
        ` Z ` +

        `M ${innerStartX} ${innerStartY}` +
        `h ${lInner}` +
        `a ${rInner} ${rInner} 0 0 1 ${rInner} ${rInner}` +
        `v ${lInner}` +
        `a ${rInner} ${rInner} 0 0 1 ${-rInner} ${rInner}` +
        `h ${-lInner}` +
        `a ${rInner} ${rInner} 0 0 1 ${-rInner} ${-rInner}` +
        `v ${-lInner}` +
        `a ${rInner} ${rInner} 0 0 1 ${rInner} ${-rInner}` +
        ` Z`;
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          d
        );
      }
    });
  }

  _basicStyle4(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;
    const rOuter = 3.5 * dotSize;
    const lOuter = size - 2 * rOuter;
    const rCircle = 2.5 * dotSize;
    const cx = x + size / 2;
    const cy = y + size / 2;
    const circleTopY = cy - rCircle;
    this._rotateFigure({
      ...args,
      draw: () => {
        const d =
        `M ${x} ${y + rOuter}` +
        `v ${lOuter}` +
        `a ${rOuter} ${rOuter} 0 0 0 ${rOuter} ${rOuter}` +
        `h ${lOuter}` +
        `L ${x + size} ${y + size}` +
        `L ${x + size} ${y + rOuter}` +
        `a ${rOuter} ${rOuter} 0 0 0 ${-rOuter} ${-rOuter}` +
        `h ${-lOuter}` +
        `a ${rOuter} ${rOuter} 0 0 0 ${-rOuter} ${rOuter}` +
        ` Z ` +
        `M ${cx} ${circleTopY}` +
        `a ${rCircle} ${rCircle} 0 0 0 0 ${2 * rCircle}` +
        `a ${rCircle} ${rCircle} 0 0 0 0 ${-2 * rCircle}` +
        ` Z`;
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          d
        );
      }
    });
  }

  _drawDot({ x, y, size, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation });
  }

  _drawExtraRounded({ x, y, size, rotation }: DrawArgs): void {
    this._basicExtraRounded({ x, y, size, rotation });
  }

  _drawStyle2({ x, y, size, rotation }: DrawArgs): void {
    this._basicStyle2({ x, y, size, rotation });
  }

  _drawStyle3({ x, y, size, rotation }: DrawArgs): void {
    this._basicStyle3({ x, y, size, rotation });
  }

  _drawStyle4({ x, y, size, rotation }: DrawArgs): void {
    this._basicStyle4({ x, y, size, rotation });
  }
}
