import { useRef, useState } from 'react'
import 'react-image-crop/dist/ReactCrop.css'
import { ReactCrop, convertToPixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { imagePreview } from '../utils/imagePreview'

const minWidth = 200;

export default function Cropper({ closeModal, image }) {
    const [crop, setCrop] = useState(null);
    let canvasRef = useRef();
    const imageRef = useRef();

    function handleCropButton() {
        imagePreview(imageRef.current, canvasRef.current, convertToPixelCrop(crop, imageRef.current.width, imageRef.current.height));
        closeModal(canvasRef.current.toDataURL('image/jpeg', 0.2));
    }

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop({ unit: "%", width: (minWidth / width) * 100 }, 1, width, height),
            width, height
        );
        setCrop(crop);
    };

    return (
        <div className='flex flex-col gap-4'>
            <p className="text-sm text-muted">Drag to reposition, or drag a corner to resize.</p>

            <div className="rounded-lg overflow-hidden border border-line bg-surface-3">
                <ReactCrop
                    className='max-h-[55vh]'
                    minWidth={minWidth}
                    circularCrop={true}
                    crop={crop}
                    aspect={1}
                    onChange={(p) => setCrop(p)}>
                    <img onLoad={onImageLoad} className='max-h-full mx-auto' ref={imageRef} src={image} alt="Your new profile photo, ready to crop" />
                </ReactCrop>
            </div>

            <canvas style={{ display: "none" }} ref={canvasRef}></canvas>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => closeModal(null)}
                    className="btn-outline-quiet flex-1 h-10"
                >
                    Discard
                </button>
                <button
                    type="button"
                    onClick={handleCropButton}
                    className='btn-solid flex-1 h-10'
                >
                    Use this photo
                </button>
            </div>
        </div>
    )
}
