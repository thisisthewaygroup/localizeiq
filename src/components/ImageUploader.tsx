'use client'

import { useCallback, useState } from 'react'
import { Upload, ImageIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  onImageSelected: (file: File, previewUrl: string) => void
  previewUrl: string | null
  onClear: () => void
}

export function ImageUploader({ onImageSelected, previewUrl, onClear }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      const url = URL.createObjectURL(file)
      onImageSelected(file, url)
    },
    [onImageSelected]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  if (previewUrl) {
    return (
      <div className="relative group rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 aspect-video max-h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Hero image"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={onClear}
            className="flex items-center gap-2 bg-white text-zinc-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
            Replace image
          </button>
        </div>
      </div>
    )
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 py-16 px-8',
        isDragging
          ? 'border-violet-500 bg-violet-50'
          : 'border-zinc-200 bg-zinc-50 hover:border-violet-400 hover:bg-violet-50/50'
      )}
    >
      <div className={cn(
        'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors',
        isDragging ? 'bg-violet-100' : 'bg-white border border-zinc-200'
      )}>
        {isDragging ? (
          <ImageIcon className="w-7 h-7 text-violet-600" />
        ) : (
          <Upload className="w-7 h-7 text-zinc-400" />
        )}
      </div>
      <div className="text-center">
        <p className="text-zinc-900 font-medium mb-1">
          {isDragging ? 'Drop your image here' : 'Upload hero image'}
        </p>
        <p className="text-zinc-500 text-sm">
          Drag & drop or click to browse · PNG, JPG, WebP
        </p>
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </label>
  )
}
