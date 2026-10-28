const birthdayScene = document.querySelector("#birthdayScene");
const sparkleField = document.querySelector("#sparkleField");
const openButton = document.querySelector("#openButton");
const surpriseNote = document.querySelector("#surpriseNote");
const replayButton = document.querySelector("#replayButton");
const musicButton = document.querySelector("#musicButton");
const musicLabel = document.querySelector("#musicLabel");
const musicStatus = document.querySelector("#musicStatus");
const birthdaySong = document.querySelector("#birthdaySong");

const sparkleCount = 24;
const confettiColors = ["#e88798", "#edb36f", "#9acdbb", "#d9a1ca", "#f0d291"];
let hasOpenedSurprise = false;

function setMusicPlaying(isPlaying) {
  musicLabel.textContent = isPlaying ? "Pause birthday song" : "Play birthday song";
  musicButton.setAttribute("aria-pressed", String(isPlaying));
}

function playBirthdaySong() {
  musicStatus.hidden = true;
  birthdaySong.play().then(() => {
    setMusicPlaying(true);
  }).catch((error) => {
    if (error.name === "AbortError") {
      return;
    }

    console.error("Unable to play the birthday song.", error);
    musicStatus.textContent = "The song couldn't be played. Try again.";
    musicStatus.hidden = false;
    setMusicPlaying(false);
  });
}

function createBackgroundSparkles() {
  for (let index = 0; index < sparkleCount; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${(index * 41 + 13) % 100}%`;
    sparkle.style.setProperty("--size", `${2 + (index % 3)}px`);
    sparkle.style.setProperty("--duration", `${10 + (index % 6)}s`);
    sparkle.style.setProperty("--delay", `${-((index * 3) % 14)}s`);
    sparkle.style.setProperty("--drift", `${((index * 17) % 80) - 40}px`);
    sparkle.style.setProperty("--opacity", `${0.2 + (index % 4) * 0.1}`);
    sparkleField.append(sparkle);
  }
}

function celebrate() {
  for (let index = 0; index < 42; index += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    confetti.style.setProperty("--x", `${Math.random() * 100}vw`);
    confetti.style.setProperty("--size", `${5 + Math.random() * 7}px`);
    confetti.style.setProperty("--color", confettiColors[index % confettiColors.length]);
    confetti.style.setProperty("--duration", `${2.2 + Math.random() * 1.8}s`);
    confetti.style.setProperty("--delay", `${Math.random() * 0.6}s`);
    confetti.style.setProperty("--drift", `${Math.round((Math.random() - 0.5) * 180)}px`);
    confetti.addEventListener("animationend", () => confetti.remove(), { once: true });
    document.body.append(confetti);
  }
}

function openSurprise() {
  if (hasOpenedSurprise) {
    return;
  }

  hasOpenedSurprise = true;
  birthdayScene.classList.add("is-revealed");
  surpriseNote.hidden = false;
  openButton.disabled = true;
  openButton.innerHTML = '<span class="button-gift" aria-hidden="true">💝</span> Your surprise is open!';
  celebrate();
  playBirthdaySong();
}

function replaySurprise() {
  birthdaySong.pause();
  birthdaySong.currentTime = 0;
  setMusicPlaying(false);
  musicStatus.hidden = true;
  surpriseNote.hidden = true;
  birthdayScene.classList.remove("is-revealed");
  document.querySelectorAll(".confetti").forEach((confetti) => confetti.remove());
  openButton.innerHTML = '<span class="button-gift" aria-hidden="true">🎁</span> Open your little surprise';
  openButton.disabled = false;
  hasOpenedSurprise = false;
}

createBackgroundSparkles();
openButton.addEventListener("click", openSurprise);
replayButton.addEventListener("click", replaySurprise);

musicButton.addEventListener("click", () => {
  if (birthdaySong.paused) {
    playBirthdaySong();
    return;
  }

  birthdaySong.pause();
  setMusicPlaying(false);
});

birthdaySong.addEventListener("ended", () => setMusicPlaying(false));
