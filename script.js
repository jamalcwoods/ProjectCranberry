
// Spotify Playlist Carousel: Loads playlistInfo.json, displays album art, and updates UI colors dynamically.
fetch('playlistInfo.json')
    .then(response => response.json())
    .then(data => {
        // Build an array of track info objects from playlist data
        const items = data.tracks && data.tracks.items ? data.tracks.items : [];
        const trackInfos = items.map(item => {
            const track = item.track;
            const album = track && track.album;
            const images = album && album.images;
            return {
                image: images && images.length > 0 ? images[0].url : '',
                artist: track && track.artists && track.artists.length > 0 ? track.artists[0].name : 'Unknown Artist',
                album: album && album.name ? album.name : 'Unknown Album',
                song: track && track.name ? track.name : 'Unknown Song'
            };
        }).filter(info => info.image);

        // Set up carousel images
        const carousel = document.getElementById('carousel');
        let currentIndex = 0;
        const images = [];
        for (let i = 0; i < trackInfos.length; i++) {
            const img = document.createElement('img');
            img.src = trackInfos[i].image;
            img.alt = `Image ${i+1}`;
            images.push(img);
            carousel.appendChild(img);
        }

        // Set up preview images (left/right)
        const prevEdge = document.querySelector('.preview-edge-left');
        const nextEdge = document.querySelector('.preview-edge-right');
        const prevPreview = document.createElement('img');
        prevPreview.className = 'preview prev-preview';
        prevPreview.src = trackInfos[0] ? trackInfos[0].image : '';
        prevPreview.alt = 'Previous Image';
        prevEdge.appendChild(prevPreview);
        const nextPreview = document.createElement('img');
        nextPreview.className = 'preview next-preview';
        nextPreview.src = trackInfos[1] ? trackInfos[1].image : '';
        nextPreview.alt = 'Next Image';
        nextEdge.appendChild(nextPreview);

        // Helper: Compute average color of an image for background
        function getAverageColor(imgElement, callback) {
            const img = new window.Image();
            img.crossOrigin = 'Anonymous';
            img.src = imgElement.src;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let r = 0, g = 0, b = 0, count = 0;
                for (let i = 0; i < imageData.data.length; i += 4) {
                    r += imageData.data[i];
                    g += imageData.data[i + 1];
                    b += imageData.data[i + 2];
                    count++;
                }
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);
                callback(`rgb(${r},${g},${b})`);
            };
            img.onerror = function() {
                callback('#f0f0f0');
            };
        }

        // Helper: Get complementary color for UI contrast
        function rgbToComplement(rgb) {
            const result = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgb);
            if (!result) return '#fff';
            let r = parseInt(result[1]), g = parseInt(result[2]), b = parseInt(result[3]);
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
            return `rgb(${r},${g},${b})`;
        }

        // Helper: Choose black or white text for best contrast
        function getContrastYIQ(rgb) {
            const result = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgb);
            if (!result) return '#222';
            let r = parseInt(result[1]), g = parseInt(result[2]), b = parseInt(result[3]);
            const yiq = ((r*299)+(g*587)+(b*114))/1000;
            return (yiq >= 128) ? '#222' : '#fff';
        }

        // Update carousel display, previews, song info, and colors
        function updateCarousel() {
            // Highlight the active image
            images.forEach((img, idx) => {
                img.classList.remove('active');
            });
            images[currentIndex].classList.add('active');

            // Update preview images
            let prevIndex = (currentIndex - 1 + images.length) % images.length;
            let nextIndex = (currentIndex + 1) % images.length;
            prevPreview.src = images[prevIndex].src;
            nextPreview.src = images[nextIndex].src;
            prevPreview.style.opacity = 1;
            nextPreview.style.opacity = 1;

            // Update song info below the carousel
            const info = trackInfos[currentIndex];
            const songInfoDiv = document.getElementById('song-info');
            songInfoDiv.innerHTML = `
                <div class="song-details">
                    <strong>Song:</strong> ${info.song}<br>
                    <strong>Artist:</strong> ${info.artist}<br>
                    <strong>Album:</strong> ${info.album}
                </div>
            `;

            // Dynamically set background and complementary UI colors
            getAverageColor(images[currentIndex], function(color) {
                document.body.style.background = color;
                const compColor = rgbToComplement(color);
                document.getElementById('song-info').style.background = compColor;
                document.getElementById('song-info').style.color = getContrastYIQ(compColor);
            });
        }

        // Initial carousel display
        updateCarousel();

        // Carousel navigation event listeners
        document.querySelector('.prev').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel();
        });
        document.querySelector('.next').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel();
        });
    });
