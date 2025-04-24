interface Dot {
	x: number;
	y: number;
}

type AnimationType = "pulse" | "grow" | "rain" | "glitter" | "shimmer";

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

class Dots {
	#animationFrameId = 0;
	#dots: Dot[] = [];
	#padding = 32;
	#baseRadius = 3;
	#animationType: AnimationType = "pulse";

	#color = "#EEF2F6";

	#columns = 20;
	#rows = 20;

	#ctx: CanvasRenderingContext2D;
	#canvas: HTMLCanvasElement;

	#dpr = Math.min(window.devicePixelRatio, 2);

	#animations: AnimationType[];

	#glitterStaticDots: number[] = [];
	#glitterAnimatingDots: number[] = [];

	constructor(canvas: HTMLCanvasElement) {
		this.#canvas = canvas;
		this.#ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

		window.addEventListener("resize", this.resize);

		this.#dots = this.#initDots();

		this.#setRandomDots();

		this.resize();
		this.update(0);

		this.#animations = ["pulse", "grow", "rain", "glitter", "shimmer"];
	}

	#setRandomDots() {
		while (this.#glitterStaticDots.length < 50) {
			this.#glitterStaticDots.push(
				Math.floor(Math.random() * this.#dots.length),
			);
		}

		while (this.#glitterAnimatingDots.length < 200) {
			this.#glitterAnimatingDots.push(
				Math.floor(Math.random() * this.#dots.length),
			);
		}
	}

	playAnimation(index: number) {
		if (index > this.#animations.length - 1 || index < 0) return;
		this.#animationType = this.#animations[index];
	}

	#initDots() {
		const dots = [];

		const totalDots = (this.#columns + 1) * this.#rows;

		for (let x = 0; x < totalDots; x++) {
			dots.push({
				x: 0,
				y: 0,
			});
		}

		return dots;
	}

	placeDots() {
		const space =
			(this.#canvas.width / this.#dpr - this.#padding * 2) / this.#columns;

		// place dots in a grid
		for (let i = 0; i < this.#dots.length; i++) {
			const columns = this.#columns + 1;
			const col = i % columns;
			this.#dots[i].x = col * space + this.#padding;
			const row = Math.floor(i / columns);
			this.#dots[i].y = row * space + space / 2;
		}
	}

	resize = () => {
		this.#canvas.width = this.#canvas.clientWidth * this.#dpr;
		this.#canvas.height = this.#canvas.clientHeight * this.#dpr;
		this.#ctx.scale(this.#dpr, this.#dpr);

		this.placeDots();
	};

	#getCenterPoint() {
		return {
			x: this.#canvas.width / (2 * this.#dpr),
			y: this.#canvas.height / (2 * this.#dpr),
		};
	}

	#calculateDistance(x1: number, y1: number, x2: number, y2: number) {
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}

	update = (time: number) => {
		this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

		if (this.#animationType === "pulse") {
			this.#updatePulseAnimation(time);
		}

		if (this.#animationType === "grow") {
			this.#updateGrowAnimation(time);
		}

		if (this.#animationType === "rain") {
			this.#updateRainAnimation(time);
		}

		if (this.#animationType === "shimmer") {
			this.#updateShimmerAnimation(time);
		}

		if (this.#animationType === "glitter") {
			this.#updateGlitterAnimation(time);
		}

		this.#animationFrameId = requestAnimationFrame(this.update);
	};

	#updatePulseAnimation(time: number) {
		const center = this.#getCenterPoint();
		const maxDistance = this.#calculateDistance(
			0,
			0,
			this.#canvas.width / this.#dpr,
			this.#canvas.height / this.#dpr,
		);

		const pulseSpeed = 10000;
		const pulseProgress = (time % 3000) / pulseSpeed;
		const pulseRadius = maxDistance * pulseProgress;

		for (const dot of this.#dots) {
			const distance = this.#calculateDistance(
				dot.x,
				dot.y,
				center.x,
				center.y - 30,
			);

			let radius = distance / maxDistance;

			const wave = Math.sin(dot.y / this.#rows / 4 + time * 0.0025) * 0.5 + 0.5;

			radius = radius > 0.205 ? this.#baseRadius : 12 * wave + this.#baseRadius;

			this.#ctx.beginPath();
			this.#ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
			this.#ctx.fillStyle = this.#color;
			this.#ctx.fill();
		}
	}

	#updateGrowAnimation(time: number) {
		const center = this.#getCenterPoint();
		const maxDistance = this.#calculateDistance(
			0,
			0,
			this.#canvas.width / this.#dpr,
			this.#canvas.height / this.#dpr,
		);
		const pulseSpeed = 10000;
		const pulseProgress = (time % 3000) / pulseSpeed;
		const pulseRadius = maxDistance * pulseProgress;

		for (const dot of this.#dots) {
			const distance = this.#calculateDistance(dot.x, 0, center.x, 0);

			let radius = distance / maxDistance;

			const wave = Math.sin(dot.y / this.#rows / 4 + time * 0.0025) * 0.5 + 0.5;

			radius = radius > 0.205 ? this.#baseRadius : 12 * wave + this.#baseRadius;

			this.#ctx.beginPath();
			this.#ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
			this.#ctx.fillStyle = this.#color;
			this.#ctx.fill();
		}
	}

	#updateRainAnimation(time: number) {
		const height = this.#canvas.height / this.#dpr;

		const waveSpeed = 0.002;
		const waveFrequency = 0.1;
		const waveAmplitude = 10;

		for (const dot of this.#dots) {
			const diagonalPosition = dot.x + height - dot.y;

			const wave =
				Math.sin(diagonalPosition * waveFrequency + time * waveSpeed) * 0.5 +
				0.5;

			const radius = lerp(this.#baseRadius, waveAmplitude, wave);

			this.#ctx.beginPath();
			this.#ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
			this.#ctx.fillStyle = this.#color;
			this.#ctx.fill();
		}
	}

	#updateGlitterAnimation(time: number) {
		for (let i = 0; i < this.#dots.length; i++) {
			const dot = this.#dots[i];

			const wave = this.#glitterAnimatingDots.includes(i)
				? lerp(this.#baseRadius, 10, Math.sin(time * 0.002 + i) * 0.5 + 0.5)
				: this.#baseRadius;

			const radius = this.#glitterStaticDots.includes(i) ? 10 : wave;

			this.#ctx.beginPath();
			this.#ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
			this.#ctx.fillStyle = this.#color;
			this.#ctx.fill();
		}
	}

	#updateShimmerAnimation(time: number) {
		const width = this.#canvas.width / this.#dpr;
		const height = this.#canvas.height / this.#dpr;

		const waveSpeed = 0.002; // Controls how fast the wave moves
		const waveFrequency = 0.1; // Controls spacing between waves
		const waveAmplitude = 10; // Max radius variation

		for (const dot of this.#dots) {
			// Project dot position along diagonal axis (bottom-left to top-right)
			const diagonalPosition = dot.x + height - dot.y;

			// Animate wave phase over time
			const wave =
				Math.sin(diagonalPosition * waveFrequency - time * waveSpeed) * 0.5 +
				0.5;

			const radius = lerp(this.#baseRadius, waveAmplitude, wave);

			this.#ctx.beginPath();
			this.#ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
			this.#ctx.fillStyle = this.#color;
			this.#ctx.fill();
		}
	}

	kill = () => {
		window.removeEventListener("resize", this.resize);
		cancelAnimationFrame(this.#animationFrameId);
	};
}

export default Dots;
