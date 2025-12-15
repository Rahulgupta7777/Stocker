import { Loader2 } from 'lucide-react';

export const Loader = () => {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-[200px]">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
    );
};

export const FullPageLoader = () => {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
    );
};
