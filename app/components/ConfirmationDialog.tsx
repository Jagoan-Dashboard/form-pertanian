import React, { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { 
  CheckCircle, 
  Info, 
  Trash2,
  Shield,
  AlertTriangle 
} from 'lucide-react';

type DialogVariant = 'default' | 'danger' | 'warning' | 'success' | 'info';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  icon?: React.ReactNode;
  loading?: boolean;
  confirmButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const variantConfig = {
  default: {
    icon: <Info className="w-5 h-5" />,
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    confirmClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  },
  danger: {
    icon: <Trash2 className="w-5 h-5" />,
    iconBg: 'bg-red-100 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
    confirmClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    iconBg: 'bg-amber-100 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    confirmClass: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
  },
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    iconBg: 'bg-green-100 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    confirmClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  },
  info: {
    icon: <Shield className="w-5 h-5" />,
    iconBg: 'bg-sky-100 dark:bg-sky-900/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
    confirmClass: 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500',
  },
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'default',
  icon,
  loading = false,
  confirmButtonVariant,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const config = variantConfig[variant];

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation error:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md rounded-2xl border-0 shadow-2xl backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 p-0 overflow-hidden"
        onPointerDownOutside={(e) => {
          if (isConfirming) e.preventDefault();
        }}
      >
        
        <div className="p-6">
          <DialogHeader className="flex flex-row items-start space-x-4 space-y-0">
            {/* Icon with animation */}
            <div className={`
              p-3 rounded-full ${config.iconBg} ${config.iconColor}
              transform transition-all hover:scale-110
              animate-in fade-in zoom-in duration-300
            `}>
              {icon || config.icon}
            </div>
            
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isConfirming}
              className={`
                w-full sm:w-auto 
                border-2 border-gray-200 dark:border-gray-700
                text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-800
                hover:border-gray-300 dark:hover:border-gray-600
                font-medium py-2.5 px-6 rounded-xl
                transition-all duration-200
                focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {cancelText}
            </Button>
            
            <Button
              onClick={handleConfirm}
              disabled={isConfirming || loading}
              className={`
                w-full sm:w-auto
                ${confirmButtonVariant === 'destructive' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : config.confirmClass}
                text-white font-medium py-2.5 px-6 rounded-xl
                transition-all duration-200 transform
                hover:scale-105 active:scale-95
                focus:ring-2 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl
              `}
            >
              {isConfirming || loading ? (
                <div className="flex items-center gap-2">
                  <svg 
                    className="animate-spin h-4 w-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Memproses...</span>
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
