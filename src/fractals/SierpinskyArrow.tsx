import React from "react";
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense

interface ComponentProps {
    //Your component props
}

const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

const SierpinskyTriangle: React.FC<ComponentProps> = (props: ComponentProps) => {
    const a = [-5, 4];
    const length = 10;
    const alpha = 0;

    let iterSlider: p5Types.Element;

    let timer: number;
    let iter: number;
    let multiplier = 100;

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(p5.windowWidth, p5.displayHeight).parent(canvasParentRef);
        iterSlider = p5.createSlider(1, 10, 1)
        iterSlider.position(10, 10);
        iterSlider.style('width', '400px');
        iterSlider.elt.addEventListener("input", () => {
            timer = p5.millis();
            p5.loop();
        })
    };

    const getAbsoluteCoords = (p5: p5Types, point: number[]) => {
        let x = point[0] * multiplier + p5.windowWidth / 2;
        let y = point[1] * multiplier + p5.windowHeight / 2;

        return [x, y]
    }

    const drawLine = (p5: p5Types, a: number[], b: number[]) => {
        const absA = getAbsoluteCoords(p5, a);
        const absB = getAbsoluteCoords(p5, b);
        p5.line(absA[0], absA[1], absB[0], absB[1]);
    }

    const drawArrowElement = async (p5: p5Types, a: number[], len: number, alpha: number, i: number) => {
        await delay(0.00001)
        const b = [
            a[0] + Math.cos(alpha - Math.PI / 3) * len / 2,
            a[1] + Math.sin(alpha - Math.PI / 3) * len / 2,
        ]
        const c = [
            b[0] + Math.cos(alpha) * len / 2,
            b[1] + Math.sin(alpha) * len / 2,
        ]
        const d = [
            c[0] + Math.cos(alpha + Math.PI / 3) * len / 2,
            c[1] + Math.sin(alpha + Math.PI / 3) * len / 2,
        ]
        if (i === 0) {
            drawLine(p5, a, b);
            drawLine(p5, b, c);
            drawLine(p5, c, d);
            p5.noLoop();
        } else {
            await drawArrowElement(p5, b, len / 2, alpha + 2 * Math.PI / 3, i - 1)
            await drawArrowElement(p5, b, len / 2, alpha, i - 1)
            await drawArrowElement(p5, d, len / 2, alpha - 2 * Math.PI / 3, i - 1)
        }
    }

    const draw = (p5: p5Types) => {
        iter = +iterSlider.value();
        p5.background(255);
        p5.fill([0, 0, 0]);
        // p5.

        drawArrowElement(p5, a, length, alpha, iter);
        console.log("Estimated time: " + String(p5.millis() - timer));

        let fps = p5.frameRate();
        p5.fill(255);
        p5.stroke(0);
        p5.text("FPS: " + fps.toFixed(2), 10, 10);
    };

    return <Sketch setup={setup} draw={draw}/>;
};

export default SierpinskyTriangle;