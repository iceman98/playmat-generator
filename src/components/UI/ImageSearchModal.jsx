import React, { useState } from 'react';
import { Search, X, Check, Loader2 } from 'lucide-react';
import styles from './ImageSearchModal.module.css';

const ImageSearchModal = ({ isOpen, onClose, onSelectImage, unsplashApiKey }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchError('');
        setSelectedImage(null);

        try {
            // Using Unsplash API for image search
            if (!unsplashApiKey) {
                throw new Error('API_KEY_REQUIRED');
            }
            
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=12&client_id=${unsplashApiKey}`);
            
            if (!response.ok) {
                throw new Error('Error en la búsqueda');
            }

            const data = await response.json();
            setSearchResults(data.results || []);
        } catch (error) {
            if (error.message === 'API_KEY_REQUIRED') {
                setSearchError('API key required. Get your free key at unsplash.com/developers and add it in Settings.');
            } else {
                setSearchError('Search failed. Please check your API key and try again.');
            }
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleImageSelect = (image) => {
        setSelectedImage(image);
    };

    const handleAccept = () => {
        if (selectedImage) {
            const imageUrl = selectedImage.urls?.regular || selectedImage;
            onSelectImage(imageUrl);
            handleClose();
        }
    };

    const handleClose = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSelectedImage(null);
        setSearchError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>Buscar Imágenes</h2>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalContent}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <input
                            type="text"
                            placeholder="Ej: dragon, space, fantasy..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                            autoFocus
                        />
                        <button type="submit" className={styles.searchButton} disabled={isSearching}>
                            {isSearching ? <Loader2 size={16} className={styles.spinner} /> : <Search size={16} />}
                        </button>
                    </form>

                    {searchError && (
                        <div className={styles.error}>
                            {searchError}
                        </div>
                    )}

                    {searchResults.length > 0 && (
                        <div className={styles.results}>
                            <h3>Resultados ({searchResults.length})</h3>
                            <div className={styles.imageGrid}>
                                {searchResults.map((image) => (
                                    <div
                                        key={image.id || image}
                                        className={`${styles.imageItem} ${selectedImage === image ? styles.selected : ''}`}
                                        onClick={() => handleImageSelect(image)}
                                    >
                                        <img
                                            src={image.urls?.small || image}
                                            alt={image.alt_description || 'Search result'}
                                            className={styles.image}
                                        />
                                        {selectedImage === image && (
                                            <div className={styles.selectedOverlay}>
                                                <Check size={20} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!isSearching && searchResults.length === 0 && searchQuery && (
                        <div className={styles.noResults}>
                            No se encontraron imágenes. Intenta con otros términos.
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={handleClose}>
                        Cancelar
                    </button>
                    <button 
                        className={styles.acceptButton} 
                        onClick={handleAccept}
                        disabled={!selectedImage}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageSearchModal;
