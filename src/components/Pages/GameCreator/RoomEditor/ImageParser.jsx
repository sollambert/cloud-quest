import { useState, useEffect } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";

function ImageParser({ roomInfo, setRoomInfo }) {

    // const densityArr = "_.,-:;+=!|?%*#$"
    const densityArr = ".,:;-^=+!?*$#@Ñ";
    // const densityArr = "$*?!+^=-;:,.";
    const [imgUrl, setImgUrl] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [width, setWidth] = useState(45);
    const [density, setDensity] = useState(densityArr.length - 1);
    const [invert, setInvert] = useState(false);
    const [noise, setNoise] = useState(0);

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function sketch(p5) {
        let tempDensity = densityArr;
        if (invert) {
            tempDensity = tempDensity.split('').reverse().join('');
        }
        if (width > 0 && width <= 60) {
            // const density = ".,-=+*:;!?$"
            // const density = "_.,-=+:;cba!?0123456789$W#@Ñ";
            let img;

            p5.preload = () => {
                img = p5.loadImage(imgUrl)
            }

            p5.setup = () => {
                img.resize(width, 0)
                img.loadPixels();
                p5.noLoop();
            }

            p5.draw = () => {
                img.loadPixels();
                let asciiImage = [];
                for (let j = 0; j < img.height; j++) {
                    let newLine = ''
                    for (let i = 0; i < img.width; i++) {
                        let randNoise = getRandomArbitrary(0, 1 - ((100 - noise) / 100));
                        // if (noise == 0) {
                        //     randNoise = 1;
                        // }
                        const pixelIndex = (i + j * img.width) * 4;
                        const r = img.pixels[pixelIndex + 0];
                        const g = img.pixels[pixelIndex + 1];
                        const b = img.pixels[pixelIndex + 2];
                        const avg = Math.min(((r + g + b) / 3) + (randNoise * 255), 255);
                        const len = density;
                        const charIndex = p5.floor(p5.map(avg, 0, 255, 0, len));
                        const c = tempDensity.charAt(charIndex);
                        newLine += c;
                    }
                    asciiImage += newLine + '\\n';
                }
                setRoomInfo({ ...roomInfo, image: asciiImage })

                //reset imgUrl value to prevent re-rendering on react render
                setImgUrl('');
            }
        }
    }

    const handleFile = (e) => {
        const url = URL.createObjectURL(e.target.files[0]);
        // console.log(url);
        setUrlInput(url);
    }

    const handleNewImage = (e) => {
        setImgUrl(urlInput);
    }

    return (
        <>
            {/* render new image ONLY when there is an image URL submitted */}
            {imgUrl != '' ? <>
                <ReactP5Wrapper sketch={sketch} />
            </> : ''}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                <div>
                    <div>
                        <label>IMG URL:</label>
                        <input
                            type="text"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="width">Width:</label>
                        <input
                            name="width"
                            style={{ width: "5vw" }}
                            type="number"
                            min="45"
                            max="60"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                        />
                        <label htmlFor="brightness">Brightness:</label>
                        <input
                            name="brightness"
                            style={{ width: "5vw" }}
                            type="number"
                            min="0"
                            max={densityArr.length - 1}
                            value={density}
                            onChange={(e) => setDensity(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="invert">Invert:</label>
                        <input
                            name="invert"
                            type="checkbox"
                            value={invert}
                            checked={invert}
                            onChange={(e) => setInvert(e.target.checked)}
                        />
                        <label htmlFor="noise">Noise:</label>
                        <input
                            className="editor-range"
                            name="noise"
                            min="0"
                            max="50"
                            type="range"
                            value={noise}
                            onChange={(e) => setNoise(e.target.value)}
                        />
                    </div>
                    <div
                        style={{ display: "flex", flexDirection: "row" }}
                    >
                        <div>
                            <label className="btn_label">
                                IMG UPLOAD
                                <input
                                    style={{ display: "none" }}
                                    type="file"
                                    onChange={(e) => handleFile(e)}
                                />
                            </label>
                        </div>
                        <button
                            className="btn"
                            onClick={handleNewImage}
                        >
                            RENDER IMG
                        </button>
                    </div>
                </div>
                {roomInfo.image != '' ?
                    <div className="room">
                        {roomInfo.image.split('\\n').map((newLine, i) => {
                            return (
                                <div key={i}>
                                    {newLine}
                                </div>
                            )
                        })}
                    </div> : ''}
            </div>
        </>
    )
}

export default ImageParser;