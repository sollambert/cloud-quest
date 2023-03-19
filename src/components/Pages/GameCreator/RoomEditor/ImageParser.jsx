import { useState, useEffect } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";

function ImageParser({ roomInfo, setRoomInfo }) {

    const [imgUrl, setImgUrl] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [width, setWidth] = useState(45);

    function sketch(p5) {
        if (width > 0 && width <= 90) {
            const density = "_.,-=+:;!?$W#@Ñ"
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
                        const pixelIndex = (i + j * img.width) * 4;
                        const r = img.pixels[pixelIndex + 0];
                        const g = img.pixels[pixelIndex + 1];
                        const b = img.pixels[pixelIndex + 2];
                        const avg = (r + g + b) / 3;
                        const len = density.length;
                        const charIndex = p5.floor(p5.map(avg, 0, 255, 0, len));
                        const c = density.charAt(charIndex);
                        newLine += c;
                    }
                    asciiImage += newLine + '\\n';
                }
                // console.log(asciiImage);
                setRoomInfo({ ...roomInfo, image: asciiImage })
                setImgUrl('');
            }
        }
    }

    const handleNewImage = (e) => {
        setImgUrl(urlInput);
    }

    return (
        <>
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
                        <label>IMG Width:</label>
                        <input
                            style={{ width: "5vw" }}
                            type="number"
                            min="0"
                            max="90"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            className="btn"
                            onClick={handleNewImage}>SET IMAGE</button>
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