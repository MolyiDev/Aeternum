// Service
const SoundService = game.GetService("SoundService");

// Variables
const backgroundMusicList = SoundService.WaitForChild("BackgroundMusics").GetChildren() as Sound[];
let currentTrack: number = math.floor(math.random() * backgroundMusicList.size());

export class MusicManager {
	// Función para reproducir la siguiente pista
	private static PlayNextTrack() {
		if (currentTrack > backgroundMusicList.size()) {
			currentTrack = 0;
		}

		const track = backgroundMusicList[currentTrack];
		track.Play();

		track.Ended.Connect(() => {
			currentTrack++;
			this.PlayNextTrack();
		});
	}

	// Function to start background music
	public static StartBackgroundMusic() {
		this.PlayNextTrack();
	}

	// Function to change the volume of the background music
	public static ChangeVolume(volume: number) {
		for (const backgroundMusic of backgroundMusicList) {
			(backgroundMusic as Sound).Volume = volume;
		}
	}
}
