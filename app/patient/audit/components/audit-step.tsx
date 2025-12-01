import { primaryFontBold } from '@/app/lib/utils/fonts';
import { cn } from '@/app/lib/utils';
import { motion } from 'motion/react';

interface OptionCardProps {
    label: string;
    selected?: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
}

export function OptionCard({ label, selected, onClick, icon }: OptionCardProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4 group",
                selected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-muted hover:border-primary/50 hover:bg-muted/50"
            )}
        >
            {icon && (
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                    {icon}
                </div>
            )}
            <span className={cn(
                "font-medium text-lg",
                selected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}>
                {label}
            </span>

            {/* Radio indicator */}
            <div className={cn(
                "ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center",
                selected ? "border-primary" : "border-muted group-hover:border-primary/50"
            )}>
                {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
        </motion.button>
    );
}

interface AuditStepProps {
    title: string;
    description: string;
    children: React.ReactNode;
    onNext?: () => void;
    nextLabel?: string;
    canNext?: boolean;
}

export function AuditStep({ title, description, children, onNext, nextLabel = "Siguiente", canNext = true }: AuditStepProps) {
    return (
        <div className="space-y-8 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className={`${primaryFontBold.className} text-2xl sm:text-3xl text-primary`}>
                    {title}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="space-y-3">
                {children}
            </div>

            {onNext && (
                <div className="pt-4 flex justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onNext}
                        disabled={!canNext}
                        className={cn(
                            "px-8 py-3 rounded-full font-bold text-white shadow-lg shadow-primary/20 transition-all",
                            canNext
                                ? "bg-primary hover:shadow-primary/40"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                    >
                        {nextLabel}
                    </motion.button>
                </div>
            )}
        </div>
    );
}
