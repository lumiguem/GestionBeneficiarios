import React from 'react';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    variant?: 'primary' | 'danger';
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
                                                         open,
                                                         title,
                                                         description,
                                                         confirmText = 'Confirmar',
                                                         cancelText = 'Cancelar',
                                                         loading = false,
                                                         variant = 'primary',
                                                         onConfirm,
                                                         onCancel
                                                     }) => {
    if (!open) return null;

    const confirmStyles =
        variant === 'danger'
            ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
                <h3 className="text-xl font-extrabold text-slate-900 mb-3">
                    {title}
                </h3>

                {description && (
                    <p className="text-slate-600 mb-8">
                        {description}
                    </p>
                )}

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-xl transition disabled:opacity-50 ${confirmStyles}`}
                    >
                        {loading ? 'Procesando...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
