import React, { useState, useMemo } from 'react';
import CertificateCard from './CertificateCard';
import certificatesData from '../data/certificates.json';
import type { Certificate, PortfolioData } from '../types/certificate';

// Cast data to new structure (handling potential mismatch if script hasn't run yet)
const data = certificatesData as unknown as PortfolioData;
// Fallback if data is still an array (old structure)
const certificates = Array.isArray(data) ? (data as Certificate[]) : (data.certificates || []);

const CertificateGrid: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('Todos');

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set(certificates.map(c => c.category || 'General'));
        return ['Todos', ...Array.from(cats)];
    }, []);

    // Filter certificates
    const filteredCertificates = useMemo(() => {
        if (activeCategory === 'Todos') return certificates;
        return certificates.filter(c => (c.category || 'General') === activeCategory);
    }, [activeCategory]);

    if (certificates.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                <p className="text-xl">No hay certificados disponibles en este momento.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Category Tabs */}
            {categories.length > 2 && ( // Only show tabs if we have multiple categories + 'Todos'
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 animate-fade-in-up">
                {filteredCertificates.map((cert) => (
                    <CertificateCard key={cert.id} certificate={cert} />
                ))}
            </div>
        </div>
    );
};

export default CertificateGrid;
