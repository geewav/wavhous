const audio = document.getElementById('audio');
const albumArt = document.getElementById('album-art');
const playPauseButton = document.getElementById('play-pause');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const progressBar = document.getElementById('progress-bar');
const trackListItems = document.querySelectorAll('.track-list li');

trackListItems.forEach(item => {
    const text = item.textContent;
    item.textContent = '';
    const span = document.createElement('span');
    span.textContent = text;
    item.appendChild(span);
});

let currentTrackIndex = 0;
let isPlaying = false;

function loadTrack(index) {
    const track = trackListItems[index];
    const src = track.getAttribute('data-src');
    const art = track.getAttribute('data-art');
    const title = track.getAttribute('data-title');

    albumArt.style.opacity = 0;

    const newImg = new Image();
    newImg.src = art;
    newImg.onload = () => {
        albumArt.src = art;
        albumArt.alt = `Album Art for ${title}`;
        albumArt.style.opacity = 1;
    };

    audio.src = src;
    document.title = title;

    trackListItems.forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
    });
    track.classList.add('active');
    track.setAttribute('aria-selected', 'true');

    progressBar.value = 0;
    progressBar.setAttribute('aria-valuenow', 0);

    if (isPlaying) {
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    }
}

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        playPauseButton.setAttribute('aria-pressed', 'false');
    } else {
        if (!audio.src) {
            currentTrackIndex = 0;
            loadTrack(currentTrackIndex);
        }
        audio.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playPauseButton.setAttribute('aria-pressed', 'true');
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    }
    isPlaying = !isPlaying;
}

function playNext() {
    currentTrackIndex = (currentTrackIndex + 1) % trackListItems.length;
    loadTrack(currentTrackIndex);
}

function playPrev() {
    currentTrackIndex = (currentTrackIndex - 1 + trackListItems.length) % trackListItems.length;
    loadTrack(currentTrackIndex);
}

playPauseButton.addEventListener('click', togglePlayPause);
document.getElementById('next').addEventListener('click', playNext);
document.getElementById('prev').addEventListener('click', playPrev);

trackListItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentTrackIndex = index;
        loadTrack(index);
        if (!isPlaying) {
            togglePlayPause();
        }
    });
    item.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' || event.code === 'Space') {
            event.preventDefault();
            currentTrackIndex = index;
            loadTrack(index);
            if (!isPlaying) {
                togglePlayPause();
            }
        }
    });
});

audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        progressBar.setAttribute('aria-valuenow', Math.round(progress));
    } else {
        progressBar.value = 0;
        progressBar.setAttribute('aria-valuenow', 0);
    }
});

progressBar.addEventListener('input', () => {
    if (!isNaN(audio.duration)) {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    }
});

audio.addEventListener('ended', playNext);

audio.addEventListener('error', (event) => {
    console.error('Error loading audio:', event);
    alert('Error loading audio. Please try again.');
});

document.addEventListener('keydown', (event) => {
    if (event.target === document.body) {
        if (event.code === 'Space') {
            event.preventDefault();
            togglePlayPause();
        } else if (event.code === 'ArrowRight') {
            playNext();
        } else if (event.code === 'ArrowLeft') {
            playPrev();
        }
    }
});

window.addEventListener('load', () => {
    progressBar.value = 0;
    progressBar.setAttribute('aria-valuenow', 0);
});