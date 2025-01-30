// Imports
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { Character } from "../../../../Character";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { RockManager } from "ReplicatedStorage/Managers/RockManager";
import { CReplicate } from "../../../../Abstracts/CReplicate";
import { Default_Hands_DashInfo } from "ReplicatedStorage/Styles/Default/Hands/Default_Hands_Dash";

@ReplicateInfo(Default_Hands_DashInfo)
export class Default_Hands_Dash extends CReplicate {
	public MarkerEnd: RBXScriptConnection = undefined!;

	public AttachmentLeft: Attachment;
	public AttachmentRight: Attachment;

	constructor(character: Character) {
		super(character);

		this.AttachmentLeft = new Instance("Attachment", character.Model.LeftFoot);
		this.AttachmentLeft.Position = new Vector3(-0.7, 0, 0);
		this.AttachmentRight = new Instance("Attachment", character.Model.RightFoot);
		this.AttachmentRight.Position = new Vector3(0.7, 0, 0);
	}

	Destroy() {
		this.Butler.Remove(this.MarkerEnd);
		this.AttachmentLeft.Destroy();
		this.AttachmentRight.Destroy();

		this.MarkerEnd = undefined!;
		this.AttachmentLeft = undefined!;
		this.AttachmentRight = undefined!;

		super.Destroy();
	}

	public AnimPlay() {
		const Highlight = this.Model.Highlight;
		Highlight.FillColor = Color3.fromRGB(255, 255, 255);

		Tools.TweenPlay(Highlight, new TweenInfo(0.125, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut), {
			FillTransparency: 0.65,
		});

		RockManager.AddAttachment(this.AttachmentLeft, {
			SubRocks: 1,
			Size: 0.17,
			Radius: 0,
			Distance: 2,
			SpawnTime: 0.15,
			UpTime: 0.075,
			LifeTime: 0.75,
		});

		RockManager.AddAttachment(this.AttachmentRight, {
			SubRocks: 1,
			Size: 0.17,
			Radius: 0,
			Distance: 2,
			SpawnTime: 0.15,
			UpTime: 0.075,
			LifeTime: 0.75,
		});
	}

	public AnimStop() {
		if (this.Model.Highlight.FillTransparency === 1) return;
		Tools.TweenPlay(this.Model.Highlight, new TweenInfo(0.125, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
			FillTransparency: 1,
		});
	}
}
