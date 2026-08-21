import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'

const ImageGallery = ({ images = [] }) => {
    const [active, setActive] = useState(0)
    const [lightbox, setLightbox] = useState(false)
    if (!images.length) {
        return <div className="w-full h-[400px] bg-slate-100 rounded-lg grid place-items-center text-slate-400">Không có ảnh</div>
    }
    const go = (d) => setActive((a) => (a + d + images.length) % images.length)

    return (
        <div className="w-full">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-slate-100 group">
                <img src={images[active]} alt="" className="w-full h-full object-cover" />
                {images.length > 1 && (
                    <>
                        <button onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 hover:bg-white grid place-items-center"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={() => go(1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 hover:bg-white grid place-items-center"><ChevronRight className="w-5 h-5" /></button>
                    </>
                )}
                <button onClick={() => setLightbox(true)} className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/70 hover:bg-white grid place-items-center"><Expand className="w-4 h-4" /></button>
            </div>
            {images.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                    {images.map((src, i) => (
                        <button key={i} onClick={() => setActive(i)} className={cn('w-20 h-16 rounded overflow-hidden shrink-0 border-2', i === active ? 'border-main' : 'border-transparent')}>
                            <img src={src} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {lightbox && (
                <div className="fixed inset-0 bg-black/90 z-[100] grid place-items-center" onClick={() => setLightbox(false)}>
                    <button className="absolute top-4 right-4 text-white w-10 h-10 grid place-items-center"><X className="w-6 h-6" /></button>
                    <img src={images[active]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    )
}

export default ImageGallery