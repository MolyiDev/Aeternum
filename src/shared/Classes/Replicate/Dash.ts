// Imports
import { IReplicateClass } from "shared/Interfaces/IReplicateClass";
import { Tools } from "shared/Libraries/Tools";
import { Butler } from "shared/Modules/Butler";
import { Character } from "../Character";

export class Dash implements IReplicateClass {
	public Butler: Butler;
	public Highlight: Highlight;
	public MarkerStart: RBXScriptConnection = undefined!;
	public MarkerEnd: RBXScriptConnection = undefined!;

	constructor(character: Character) {
		this.Butler = character.Butler;
		this.Highlight = character.Model.Highlight;
	}

	Stop() {
		this.Butler.RemoveList(this.MarkerStart, this.MarkerEnd);

		this.Butler = undefined!;
		this.Highlight = undefined!;
		this.MarkerStart = undefined!;
		this.MarkerEnd = undefined!;
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		const Butler = this.Butler;
		const Highlight = this.Highlight;

		this.MarkerStart = Butler.Connect(animTrack.GetMarkerReachedSignal("DashStart"), () => {
			Highlight.FillColor = Color3.fromRGB(255, 255, 255);

			Tools.TweenPlay(Highlight, new TweenInfo(0.125, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut), {
				FillTransparency: 0.65,
			});
		});

		this.MarkerEnd = Butler.Connect(animTrack.GetMarkerReachedSignal("End"), () => {
			Tools.TweenPlay(Highlight, new TweenInfo(0.125, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut), {
				FillTransparency: 1,
			});
		});
	}
}
