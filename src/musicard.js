const { Canvas } = require('canvas-constructor/cairo');
const canvas = require('canvas');
canvas.registerFont(`${process.cwd()}/src/res/momcakebold.ttf`, { family: 'momcakebold' });
canvas.registerFont(`${process.cwd()}/src/res/fonts/notoemoji-bold.ttf`, { family: 'notoemoji-bold' });
const { getColorFromURL } = require('color-thief-node');
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}M ${remainingSeconds.toString().padStart(2, '0')}Sec`;
}

class musicCard {
    constructor() {
        this.name = null;
        this.author = null;
        this.brightness = null;
        this.thumbnail = null;
        this.progress = null;
        this.starttime = null;
        this.endtime = null;
        this.voiceChannel = null;
        this.data = null;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setAuthor(author) {
        this.author = author;
        return this;
    }

    setBrightness(brightness) {
        this.brightness = brightness;
        return this;
    }

    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;
        return this;
    }

    setProgress(progress) {
        this.progress = progress;
        return this;
    }

    setStartTime(starttime) {
        this.starttime = starttime;
        return this;
    }

    setEndTime(endtime) {
        this.endtime = endtime;
        return this;
    }

    setVoiceChannel(voiceChannel) {
        this.voiceChannel = voiceChannel;
        return this;
    }

    setData(data) {
        this.data = data;
        return this;
    }

    async rgbToHex(r, g, b) {
        const toHex = (value) => {
            const hex = value.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        const hexR = toHex(r);
        const hexG = toHex(g);
        const hexB = toHex(b);

        return `#${hexR}${hexG}${hexB}`;
    }

    async adjustBrightness(r, g, b, adjustment) {
        const adjustedR = Math.max(0, Math.min(255, r + adjustment));
        const adjustedG = Math.max(0, Math.min(255, g + adjustment));
        const adjustedB = Math.max(0, Math.min(255, b + adjustment));

        return [adjustedR, adjustedG, adjustedB];
    }

    async build() {
        if (!this.name) { throw new Error('Missing name parameter'); }
        if (!this.author) { throw new Error('Missing author parameter'); }

        let validatedProgress = parseFloat(this.progress);
        if (Number.isNaN(validatedProgress) || validatedProgress < 0 || validatedProgress > 100) {
            throw new Error('Invalid progress parameter, must be between 0 to 100');
        }

        if (validatedProgress < 2) {
            validatedProgress = 2;
        }

        const thumbnailURL = this.thumbnail || `${process.cwd()}/src/res/noimage.jpg`;
        const validatedStartTime = this.starttime || '0:00';
        const validatedEndTime = this.endtime || '0:00';
        const validatedBrightness = parseInt(this.brightness) || 0;

        let validatedColor = '9900ff';

        const progressBarWidth = (validatedProgress / 100) * 670;
        const circleX = progressBarWidth + 60;

        const progressBarCanvas = canvas.createCanvas(670, 25);
        const progressBarCtx = progressBarCanvas.getContext('2d');
        const cornerRadius = 45;
        progressBarCtx.beginPath();
        progressBarCtx.moveTo(cornerRadius, 0);
        progressBarCtx.lineTo(670 - cornerRadius, 0);
        progressBarCtx.arc(670 - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
        progressBarCtx.lineTo(670, 25 - cornerRadius);
        progressBarCtx.arc(670 - cornerRadius, 25 - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
        progressBarCtx.lineTo(cornerRadius, 25);
        progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
        progressBarCtx.lineTo(0, cornerRadius);
        progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
        progressBarCtx.closePath();
        progressBarCtx.fillStyle = '#ababab';
        progressBarCtx.fill();
        progressBarCtx.beginPath();
        progressBarCtx.moveTo(cornerRadius, 0);
        progressBarCtx.lineTo(progressBarWidth - cornerRadius, 0);
        progressBarCtx.arc(
            progressBarWidth - cornerRadius,
            cornerRadius,
            cornerRadius,
            1.5 * Math.PI,
            2 * Math.PI,
        );
        progressBarCtx.lineTo(progressBarWidth, 25);
        progressBarCtx.lineTo(cornerRadius, 25);
        progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
        progressBarCtx.lineTo(0, cornerRadius);
        progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
        progressBarCtx.closePath();
        progressBarCtx.fillStyle = `#${validatedColor}`;
        progressBarCtx.fill();

        const circleCanvas = canvas.createCanvas(1000, 1000);
        const circleCtx = circleCanvas.getContext('2d');

        const circleRadius = 20;
        const circleY = 97;

        circleCtx.beginPath();
        circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
        circleCtx.fillStyle = `#${validatedColor}`;
        circleCtx.fill();

        const img = await canvas.loadImage(`${process.cwd()}/src/res/background.png`);

        const thumbnailCanvas = canvas.createCanvas(900, 900);
        const thumbnailCtx = thumbnailCanvas.getContext('2d');
        
        let thumbnailImage;
        try {
            let icon = `https://img.youtube.com/vi/${this.data.queue.current.identifier}/maxresdefault.jpg`;
            thumbnailImage = await canvas.loadImage(icon);
        } catch (error) {
            thumbnailImage = await canvas.loadImage(`${process.cwd()}/src/res/noimage.jpg`);
        }
        
        const min = (thumbnailImage.width + thumbnailImage.height) / 2;
        thumbnailCtx.imageSmoothingEnabled = true;
        const thumbnailRadius = 20;
        
        thumbnailCtx.beginPath();
        thumbnailCtx.moveTo(thumbnailCanvas.width - thumbnailRadius, 0);
        thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailRadius, thumbnailRadius);
        thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, thumbnailCanvas.width - thumbnailRadius, thumbnailCanvas.height, thumbnailRadius);
        thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, thumbnailCanvas.height - thumbnailRadius, thumbnailRadius);
        thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width - thumbnailRadius, 0, thumbnailRadius);
        thumbnailCtx.closePath();
        
        thumbnailCtx.clip();
        
        thumbnailCtx.drawImage(
            thumbnailImage,
            0,
            0,
            thumbnailImage.width,
            thumbnailImage.height,
            0,
            0,
            thumbnailCanvas.width,
            thumbnailCanvas.height
        );

        // gradient
        const imageURL = `https://img.youtube.com/vi/${this.data.queue.current.identifier}/maxresdefault.jpg`

        const dominantColor = await getColorFromURL(imageURL)
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        async function getThumbnailAverageColor(iconUrl) {
            try {
                // Load the thumbnail image
                const thumbnailImage = await canvas.loadImage(iconUrl);

                // Crop the image to 1 pixel from the top and half the height
                const canvasWidth = thumbnailImage.width;
                const canvasHeight = Math.floor(thumbnailImage.height / 2);
                const thumbnailCanvas = canvas.createCanvas(canvasWidth, canvasHeight);
                const thumbnailCtx = thumbnailCanvas.getContext('2d');
                thumbnailCtx.drawImage(thumbnailImage, 0, 0, canvasWidth, canvasHeight);

                // Get the color data for the pixel at (1, 0)
                const imageData = thumbnailCtx.getImageData(1, 0, 1, 1).data;
                const [r, g, b] = imageData;

                // Convert the RGB values to a hex color
                const hexColor = rgbToHex(r, g, b);

                return hexColor;
            } catch (error) {
                console.error('Error:', error);
                return null;
            }
        }
        function rgbToHex(r, g, b) {
            const componentToHex = (c) => {
                const hex = c.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
            return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }
        const [r, g, b] = dominantColor;
        const hexColor = rgbToHex(r, g, b);

        const pxHex = await getThumbnailAverageColor(imageURL)


        const gradientCanvas = canvas.createCanvas(670, 25);
        const gradientCtx = gradientCanvas.getContext('2d');
        gradientCtx.globalCompositeOperation = "source-out";

        // Create a linear gradient from left to right
        const gradient = gradientCtx.createLinearGradient(0, 0, 315, 100);
        gradient.addColorStop(0, `#242424`);
        gradient.addColorStop(0.5, `rgba(36, 36, 36, 0.7)`);

        gradient.addColorStop(1, pxHex);


        gradientCtx.fillStyle = gradient;
        gradientCtx.fillRect(0, 0, 315, 60);
        // gradient end

        if (this.name.length > 35) this.name = `${this.name.slice(0, 35)}...`;
        if (this.author.length > 35) this.author = `${this.author.slice(0, 35)}...`;
        const player = this.data;
        const currentPositionInSeconds = (!player.position || isNaN(player.position)) ? 0 : player.position / 1000;
        const totalDurationInSeconds = (!player.queue.current.duration || isNaN(player.queue.current.duration)) ? 0 : player.queue.current.duration / 1000;


        const remainingTimeInSeconds = totalDurationInSeconds - currentPositionInSeconds;

        const remainingSecondsFormatted = remainingTimeInSeconds.toFixed(2);

        const endTimeString = formatTime(remainingSecondsFormatted);

        let nextSongText = 'Next Song: No song in queue';


        if (player.queue.length > 0) {
            const nextSong = player.queue[0];
            if (nextSong && nextSong.title) {
                nextSongText = `Next Song: ${nextSong.title.length >= 15 ? `${nextSong.title.slice(0, 15)}...` : nextSong.title}`;
            }
        }
        let requester = player.queue.current.requester.username;

        if (requester.length >= 10) {
            requester = `${requester.slice(0, 10)}...`;
        }


        const image = new Canvas(1280, 450)
            .setColor(`#${validatedColor}`)

            .printImage(img, 0, 0, 1280, 450)
            .printImage(thumbnailCanvas, 837, 8, 435, 435).printImage(gradientCanvas, 720, 8, 290, 435)
            .setTextFont('45px momcakebold, noto-emoji')
            .printText(`${this.name}`, 60, 100)

            .setColor('#fff')
            .setTextFont('35px momcakebold, noto-emoji')
            .printText(`Author: ${this.author}`, 60, 150)

            .setColor('#9900ff')
            .setTextFont('35px momcakebold, noto-emoji')
            .printText(`Voice channel: ${this.voiceChannel}`, 60, 200)

            .setColor('#fff')
            .setTextFont('35px momcakebold, noto-emoji')
            .printText(`ENDS IN: ${endTimeString}`, 60, 250)

            .setColor('#9900ff')
            .setTextFont('35px momcakebold, noto-emoji')
            .printText(nextSongText, 60, 300)

            .setColor('#fff')
            .setTextFont('30px momcakebold, noto-emoji')
            .printText(`${validatedStartTime}`, 70, 410)

            .setColor('#9900ff')
            .setTextFont('30px momcakebold, noto-emoji')
            .printText(`Requested by: ${requester}`, 215, 410)

            .setColor('#fff')
            .setTextFont('30px momcakebold, noto-emoji')
            .printText(`${validatedEndTime}`, 675, 410)



            .printImage(progressBarCanvas, 70, 340, 670, 25)
            .printImage(circleCanvas, 10, 255, 1000, 1000)

            .toBuffer();
        return image;
    }
}

module.exports = { musicCard };