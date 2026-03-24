import { Loader2 } from 'lucide-react';

const Spinner = ({ fullPage = false, size = 24 }) => {
    if (fullPage) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#050505] z-50">
                <Loader2 size={40} className="animate-spin text-matrix" />
            </div>
        );
    }
    return <Loader2 size={size} className="animate-spin text-matrix" />;
};

export default Spinner;
