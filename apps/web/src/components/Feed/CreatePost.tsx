import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Image, Smile, X } from 'lucide-react';
import clsx from 'clsx';
import { supabase } from '@/lib/supabase';

interface CreatePostProps {
    onSubmit: (content: string, imageUrls?: string[]) => Promise<void>;
}

export function CreatePost({ onSubmit }: CreatePostProps) {
    const { user, profile } = useAuthStore();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showEmojiPicker]);

    const handleSubmit = async () => {
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content, uploadedImages);
            setContent('');
            setUploadedImages([]);
        } catch (error) {
            console.error('Failed to post', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user?.id}-${Date.now()}-${Math.random()}.${fileExt}`;
                const filePath = `posts/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('posts')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('posts')
                    .getPublicUrl(filePath);

                return publicUrl;
            });

            const urls = await Promise.all(uploadPromises);
            setUploadedImages(prev => [...prev, ...urls]);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images. Please try again.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const insertEmoji = (emoji: string) => {
        setContent(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const commonEmojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '🔥', '💯', '✅', '❌', '🚀', '⭐', '💡', '🎯', '🔧', '💻', '📱', '☕', '🏆', '🎉'];

    return (
        <div className="bg-charcoal-900/40 rounded-xl border border-charcoal-800 p-5 mb-6 backdrop-blur-sm">
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                <img
                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=random`}
                    alt={profile?.username || 'User'}
                    className="w-10 h-10 rounded-full bg-charcoal-700 object-cover"
                />
            </div>
            <div className="flex-1">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What is happening in this protocol?"
                    className="w-full bg-transparent text-white placeholder-grey-600 text-lg border-none focus:ring-0 p-0 resize-none min-h-[100px] focus:placeholder-grey-700 font-sans"
                    rows={2}
                />

                {/* Image Previews */}
                {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                        {uploadedImages.map((url, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={url}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border border-charcoal-700"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-charcoal-700/60">
                    <div className="flex items-center gap-2 text-primary-500 relative">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="p-2 rounded-full text-grey-500 hover:text-grey-200 hover:bg-charcoal-700/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Image className="w-5 h-5" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 rounded-full text-grey-500 hover:text-grey-200 hover:bg-charcoal-700/50 transition-all duration-200"
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                        
                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                            <div
                                ref={emojiPickerRef}
                                className="absolute bottom-full left-0 mb-2 w-64 bg-charcoal-900 border border-charcoal-700 rounded-xl p-3 shadow-2xl z-10"
                            >
                                <div className="grid grid-cols-6 gap-1">
                                    {commonEmojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            onClick={() => insertEmoji(emoji)}
                                            className="h-9 w-9 flex items-center justify-center hover:bg-charcoal-700 rounded-lg transition-colors text-lg"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 text-xs text-grey-500">Tap emoji to insert</div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!content.trim() || isSubmitting}
                        className={clsx(
                            "px-4 py-1.5 rounded-full font-bold text-sm transition-all duration-200 flex items-center gap-2",
                            !content.trim() || isSubmitting
                                ? "bg-charcoal-800 text-grey-500 cursor-not-allowed opacity-60"
                                : "bg-white text-black hover:bg-grey-100 hover:shadow-md active:scale-95"
                        )}
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}
