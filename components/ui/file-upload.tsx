'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
    onUpload: (file: File) => void
    onUploadComplete?: (url: string) => void
    onError?: (error: string) => void
    className?: string
    disabled?: boolean
    isUploading?: boolean
}

export function FileUpload({
    onUpload,
    onUploadComplete,
    onError,
    className,
    disabled = false,
    isUploading = false
}: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                onError?.('Please upload an image file')
                return
            }

            // Validate file size (4MB)
            if (file.size > 4 * 1024 * 1024) {
                onError?.('File size must be less than 4MB')
                return
            }

            setUploadedFile(file)

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)

            // Call upload handler
            onUpload(file)
        }
    }, [onUpload, onError])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        multiple: false,
        disabled: disabled || isUploading
    })

    const clearFile = () => {
        setPreview(null)
        setUploadedFile(null)
    }

    if (preview && !isUploading) {
        return (
            <div className={cn("space-y-4", className)}>
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full max-h-64 object-contain rounded-lg border bg-gray-50"
                    />
                    <Button
                        onClick={clearFile}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="text-sm text-gray-600 text-center">
                    <p className="font-medium">{uploadedFile?.name}</p>
                    <p>{uploadedFile && (uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            </div>
        )
    }

    if (isUploading) {
        return (
            <div className={cn("border-2 border-dashed border-blue-300 rounded-lg p-12 text-center bg-blue-50", className)}>
                <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Uploading Image...
                    </h3>
                    <p className="text-blue-600">
                        Please wait while we process your file
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
                disabled && "cursor-not-allowed opacity-50",
                className
            )}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    {isDragActive ? (
                        <Upload className="h-8 w-8 text-blue-600" />
                    ) : (
                        <ImageIcon className="h-8 w-8 text-gray-600" />
                    )}
                </div>

                {isDragActive ? (
                    <div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                            Drop your image here
                        </h3>
                        <p className="text-blue-600">
                            Release to upload
                        </p>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Drop an image here, or click to browse
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Supports JPG, PNG, WebP • Max size: 4MB
                        </p>

                    </div>
                )}
            </div>
        </div>
    )
}