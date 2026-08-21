import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Toast đơn giản (DOM-based, không cần thư viện)
export function toast(message, isError = false) {
  if (typeof window === 'undefined') return
  const el = document.createElement('div')
  el.textContent = message
  el.className = twMerge(clsx([
    'fixed top-5 right-5 z-[9999] px-4 py-3 rounded-md shadow-lg text-sm font-medium max-w-sm',
    isError ? 'bg-red-500 text-white' : 'bg-main text-white',
    'animate-in fade-in slide-in-from-top-2 duration-300',
  ]))
  document.body.appendChild(el)
  setTimeout(() => {
    el.style.transition = 'opacity .3s'
    el.style.opacity = '0'
    setTimeout(() => el.remove(), 300)
  }, 2500)
}